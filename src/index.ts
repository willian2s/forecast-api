import config, { IConfig } from 'config';

const dbConfig: IConfig = config.get('App.database');

console.log('test', dbConfig.get('mongoUrl'));
