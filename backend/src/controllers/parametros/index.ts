import { ParametrosRepository } from './parametrosRepository';
import { ParametrosService } from './parametrosService';

const parametrosService = new ParametrosService();
const parametrosRepository = new ParametrosRepository();

export {
  parametrosService,
  parametrosRepository,
}