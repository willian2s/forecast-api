import './utils/module-alias';
import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import expressPino from 'express-pino-logger';
import cors from 'cors';
import SwaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import apiSchema from './api.schema.json';
import * as database from '@src/database';
import { ForcastController } from '@src/controllers/forecast';
import { BeachesController } from '@src/controllers/beaches';
import { UsersController } from '@src/controllers/users';
import logger from '@src/logger';
import { apiErrorValidator } from '@src/middlewares/api-error-validator';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.docsSetup();
    this.setupControllers();
    await this.setupDatabase();
    this.setupErrorHandlers();
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(
      expressPino({
        logger,
      })
    );
    this.app.use(
      cors({
        origin: '*',
      })
    );
  }

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  private setupControllers(): void {
    const forecastController = new ForcastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  private docsSetup(): void {
    this.app.use('/docs', SwaggerUi.serve, SwaggerUi.setup(apiSchema));
    OpenApiValidator.middleware({
      apiSpec: apiSchema as OpenAPIV3.Document,
      validateRequests: true,
      validateResponses: true,
    });
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

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info(`Server listeing on port: ${this.port}`);
    });
  }
}
