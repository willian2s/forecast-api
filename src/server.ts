import './utils/module-alias';
import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import { ForcastController } from '@src/controllers/forecast';
import * as database from '@src/database';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }

  private setupControllers(): void {
    const forecastController = new ForcastController();
    this.addControllers([forecastController]);
  }

  public getApp(): Application {
    return this.app;
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }
}
