import { iopsApi } from 'api';
import { default as error } from './error';

export default [iopsApi.middleware, error];
