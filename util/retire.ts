import axios from 'axios';
import * as cheerio from 'cheerio';

async function retireNexus8(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const targetTds = $('div').filter(function () {
      return $(this).text().trim() === "PEG Ratio";
    }).parent().siblings();
    const pegRatios: number[] = targetTds.toArray()
      .map(ele => parseFloat($(ele).text()))
      .filter(num => !Number.isNaN(num));
    console.log(pegRatios);
  } catch (error) {
    console.error('Error fetching or parsing the page:', error);
  }
}

// Replace with the URL you want to scrape
retireNexus8('https://stockanalysis.com/stocks/crwd/financials/ratios/?p=quarterly');
