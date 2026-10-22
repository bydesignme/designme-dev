// the shared core's script for the demos: mounting, replay, tooltips, popovers
import { CORE } from '../../../lib/data.mjs';
export function GET(){ return new Response(CORE.js, { headers:{ 'Content-Type':'text/javascript; charset=utf-8' } }); }
