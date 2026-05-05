import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTrial } from './user-trial.entity';
import { CreateUserTrialDto } from './dto/create-user-trial.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class UserTrialService {
  constructor(
    @InjectRepository(UserTrial)
    private userTrialRepository: Repository<UserTrial>,
  ) {}

  async create(createUserTrialDto: CreateUserTrialDto): Promise<UserTrial> {
    const userTrial = this.userTrialRepository.create(createUserTrialDto);
    return this.userTrialRepository.save(userTrial);
  }

  async findAll(paging: number = 1, limit: number = 10) {
    const [items, total] = await this.userTrialRepository.findAndCount({
      select: ['id', 'fullname', 'phone', 'email', 'companyName', 'jobRole', 'createdAt'],
      skip: (paging - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      paging,
      limit,
    };
  }

  async exportExcel(res: Response) {
    const data = await this.userTrialRepository.find({
      order: { createdAt: 'DESC' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('User Trials');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Full Name', key: 'fullname', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Company Name', key: 'companyName', width: 30 },
      { header: 'Job Role', key: 'jobRole', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        id: item.id,
        fullname: item.fullname,
        phone: item.phone,
        email: item.email,
        companyName: item.companyName,
        jobRole: item.jobRole,
        createdAt: item.createdAt.toLocaleString(),
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'UserTrials.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
