import axios, { AxiosInstance } from 'axios';

const API_KEY = '';
const FILE_ID = '1HRWFwU-yhNT5RVz-GwCN1N2BqowGRVQg4XDkErblgrw';

export default class SheetsStore {
  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create();
  }

  private getSheetData(file: string, sheet: string) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${file}/values/${sheet}?alt=json&key=${API_KEY}`;
    this.axiosInstance.get(url).then((data) => {
      console.log('data: ', data);
    });
  }

  getGotmNoms() {
    return this.getSheetData(FILE_ID, 'gotm-noms');
  }

  getRetorbits() {
    return this.getSheetData(FILE_ID, 'RetroBits');
  }
}
