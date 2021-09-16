import pino from 'pino';
import config from 'config';

const enabled: boolean = config.get('App.logger.enabled');
const level: string = config.get('App.logger.level');

export default pino({
  enabled: enabled,
  level: level,
});
