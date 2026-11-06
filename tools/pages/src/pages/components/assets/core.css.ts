// the shared core's styles for the demos, with Blueprint's square corners kept inside the demo
import { demoCoreCss } from '../../../lib/data.mjs';
export function GET(){ return new Response(demoCoreCss(), { headers:{ 'Content-Type':'text/css; charset=utf-8' } }); }
