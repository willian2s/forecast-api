import './utils/module-alias';
import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import { ForcastController } from '@src/controllers/forecast';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
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
}
