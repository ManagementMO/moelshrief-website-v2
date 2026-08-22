import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const sitemapUrl = 'https://moelshrief.com/sitemap.xml';

async function submitSitemap() {
  try {
    // Bing Webmaster Tools
    const bingSubmitUrl = `https://www.bing.com/ping?sitemap=${sitemapUrl}`;
    const { stdout: bingOutput } = await execAsync(`curl "${bingSubmitUrl}"`);
    console.log('Submitted to Bing Webmaster Tools:', bingOutput);

    console.log('\nTo submit your sitemap to Google Search Console:');
    console.log('1. Go to https://search.google.com/search-console');
    console.log('2. Select your property');
    console.log('3. Go to Sitemaps in the left menu');
    console.log('4. Enter "sitemap.xml" in the "Add a new sitemap" field');
    console.log('5. Click "Submit"');
    
    console.log('\nTo submit your sitemap to Bing Webmaster Tools:');
    console.log('1. Go to https://www.bing.com/webmasters');
    console.log('2. Select your site');
    console.log('3. Go to Sitemaps in the left menu');
    console.log('4. Enter "sitemap.xml" in the "Submit a sitemap" field');
    console.log('5. Click "Submit"');
  } catch (error) {
    console.error('Error submitting sitemap:', error);
  }
}

submitSitemap(); 