import axios from 'axios';
import * as cheerio from 'cheerio';

const SLICE_DATE = 7; // index of last unwanted date
const SLICE_DATA = 7;
/*
 * returns recent price-earnings-growth ratio
 * */
export async function retireNexus8(ticker: string) {
  try {
    const url = `https://stockanalysis.com/stocks/${ticker.toLowerCase()}/financials/ratios/?p=quarterly`
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // get dates for peg ratios
    const dateTds = $('div').filter(function () {
      return $(this).text().trim() === "Period Ending";
    }).parent().siblings();
    const periods = dateTds.toArray()
      .map(ele => $(ele).text().slice(SLICE_DATE));

    // get peg ratios 
    const targetTds = $('div').filter(function () {
      return $(this).text().trim() === "PEG Ratio";
    }).parent().siblings();
    const pegRatios: number[] = targetTds.toArray()
      .map(ele => parseFloat($(ele).text()))
      .filter(num => !Number.isNaN(num))
      .slice(0, SLICE_DATA);

    periods.splice(pegRatios.length);

    if (periods.length === pegRatios.length) {
      return periods.map((period, i) => [period, pegRatios[i]]);
    }
  } catch (error) {
    console.error('Error fetching or parsing the page:', error);
    return [];
  }
}

/*
 * returns recent growth rates
 * */
export async function retireNexus6(ticker: string) {
  try {
    const url = `https://stockanalysis.com/stocks/${ticker.toLowerCase()}/financials/?p=quarterly`
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // get dates for peg ratios
    const dateTds = $('div').filter(function () {
      return $(this).text().trim() === "Period Ending";
    }).parent().siblings();
    const periods = dateTds.toArray()
      .map(ele => $(ele).text().slice(SLICE_DATE));

    const targetTds = $('div').filter(function () {
      return $(this).text().trim() === "Revenue Growth (YoY)";
    }).parent().siblings();
    const revGrowth: number[] = targetTds.toArray()
      .map(ele => parseFloat($(ele).text()))
      .filter(num => !Number.isNaN(num))
      .slice(0, SLICE_DATA);

    periods.splice(revGrowth.length);

    if (periods.length === revGrowth.length) {
      return periods.map((period, i) => [period, revGrowth[i]]);
    }

  } catch (error) {
    console.error('Error fetching or parsing the page:', error);
  }
}

/*
 * returns recent p/fcf rates
 * */
export async function retireNexus9(ticker: string) {
  try {
    const url = `https://stockanalysis.com/stocks/${ticker.toLowerCase()}/financials/ratios/?p=quarterly`
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // get dates for peg ratios
    const dateTds = $('div').filter(function () {
      return $(this).text().trim() === "Period Ending";
    }).parent().siblings();
    const periods = dateTds.toArray()
      .map(ele => $(ele).text().slice(SLICE_DATE));

    const targetTds = $('div').filter(function () {
      return $(this).text().trim() === "P/FCF Ratio";
    }).parent().siblings();
    const fcfRatios: number[] = targetTds.toArray()
      .map(ele => parseFloat($(ele).text()))
      .filter(num => !Number.isNaN(num))
      .slice(0, SLICE_DATA);

    periods.splice(fcfRatios.length);

    if (periods.length === fcfRatios.length) {
      return periods.map((period, i) => [period, fcfRatios[i]]);
    }

  } catch (error) {
    console.error('Error fetching or parsing the page:', error);
  }
}

/*
 * returns recent p/s rates
 * */
export async function retireNexus4(ticker: string) {
  try {
    const url = `https://stockanalysis.com/stocks/${ticker.toLowerCase()}/financials/ratios/?p=quarterly`
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // get dates for peg ratios
    const dateTds = $('div').filter(function () {
      return $(this).text().trim() === "Period Ending";
    }).parent().siblings();
    const periods = dateTds.toArray()
      .map(ele => $(ele).text().slice(SLICE_DATE));

    const targetTds = $('div').filter(function () {
      return $(this).text().trim() === "PS Ratio";
    }).parent().siblings();
    const fcfRatios: number[] = targetTds.toArray()
      .map(ele => parseFloat($(ele).text()))
      .filter(num => !Number.isNaN(num))
      .slice(0, SLICE_DATA);

    periods.splice(fcfRatios.length);

    if (periods.length === fcfRatios.length) {
      return periods.map((period, i) => [period, fcfRatios[i]]);
    }

  } catch (error) {
    console.error('Error fetching or parsing the page:', error);
  }
}
// Replace with the URL you want to scrape
// retireNexus8('CRWD');
// retireNexus6('CRWD');
// retireNexus9('CRWD');
// retireNexus4('CRWD');
