const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// Reference: https://developers.google.com/sheets/api/quickstart/nodejs
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];  // read & write permission
const TOKEN_PATH = 'accessToken.json';

class SheetApiClientFactory {
  static async create() {
    const credential = fs.readFileSync('../_excluded/darkchoco-cboard-credentials.json', 'utf-8');
    const auth = await this._authorize(JSON.parse(credential));
    return google.sheets({version: 'v4', auth});
  }

  static async _authorize(credentials) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );

    // 기존에 받아둔 access token이 없으면 새로 발급 요청
    if (!fs.existsSync(TOKEN_PATH)) {
      const token = await this._getNewToken(oAuth2Client);
      oAuth2Client.setCredentials(token);

      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('Token stored to', TOKEN_PATH);

      return oAuth2Client;
    }

    // 받아둔 access token이 있으면 바로 사용
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  }

  static async _getNewToken(oAuth2Client) {
    // OAuth 인증 진행을 위한 URL 생성
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('다음 URL을 브라우저에서 열어 인증을 진행하세요:', authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const code = await new Promise((resolve) => {
      rl.question(
        '인증이 완료되어 발급된 코드를 여기에 붙여넣으세요: ',
        (code) => {
          resolve(code);
        },
      );
    });

    rl.close();

    const resp = await oAuth2Client.getToken(code);
    return resp.tokens;
  }
}

module.exports = SheetApiClientFactory;
