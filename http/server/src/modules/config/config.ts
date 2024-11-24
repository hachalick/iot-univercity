import { registerAs } from '@nestjs/config';

export enum ConfigKeys {
  App = 'App',
  Db = 'Db',
  Tel = 'Tel',
}

const AppConfig = registerAs(ConfigKeys.App, () => ({
  PORT_SERVER: 8080,
  TOKEN_SMS: '487A7372316B317641566D614F667569354172356353487238422F3269744A416E4F41346578724A5531633D',
  token_hash_password:
    '9d5329a7398f66c17fe654279ae80c59a330c205c28408fb9e9d2f38e3b4cf8908fbac459d89eba4780f75d234471d8bf5722ae24acb226a76ec38c2a79358a2ab5125ddc39cc5fcff2bf2984eb7a905',
  token_access_token:
    '816fd9909ccb22cacbc1af0786270f8e8c2b0de0342b079b9760e428f951',
  token_refresh_token:
    '162a16c15e3c99d08d6be39967917c2c4d8604cdcca02c2b3813aff34d34',
  token_time_access_token: '1d',
  token_time_refresh_token: '10d',
  token_hash_telegram: '70ac1c51f215e25ae15f2b46',
}));

const DbConfig = registerAs(ConfigKeys.Db, () => ({
  port: 3306,
  database: 'iot',
  host: '127.0.0.1',
  username: 'root',
  password: 'Hoseinf0&&1',
}));

export const configurations = [AppConfig, DbConfig];
