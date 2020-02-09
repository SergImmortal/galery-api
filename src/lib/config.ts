import path from "path";
import yaml from 'js-yaml';
import fs from 'fs';

export const BASE_PATH: string = path.join(__dirname, "../..");
export const config: any = yaml.safeLoad(fs.readFileSync(BASE_PATH + '/config.yaml', 'utf8'));