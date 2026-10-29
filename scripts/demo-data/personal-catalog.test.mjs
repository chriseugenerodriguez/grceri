import test from 'node:test';import assert from 'node:assert/strict';
import {loadPersonalCatalog} from '../../frontend/src/lib/personal-catalog.mjs';
test('catalog reads all pages from grceri and rebuilds category tree',async()=>{
 const calls=[];const products=Array.from({length:610},(_,id)=>({payload:{sem3_id:String(id)}}));
 const fetcher=async(url,opts)=>{calls.push({url,opts});if(url==='/personal-demo.json')return{ok:true,json:async()=>({url:'https://personal.example',anonKey:'public'})};const u=new URL(url);return{ok:true,json:async()=>u.pathname.endsWith('demo_products')?products.slice(Number(u.searchParams.get('offset')),Number(u.searchParams.get('offset'))+500):[{id:'18203',parent_id:null,position:0,child_key:'categories'},{id:'2',parent_id:'18203',name:'Food',position:0,child_key:null}]};};
 const [rows,tree]=await loadPersonalCatalog(new AbortController().signal,fetcher);assert.equal(rows.length,610);assert.equal(tree.groceries.categories[0].name,'Food');assert.equal(calls.length,4);assert.ok(calls.slice(1).every(c=>c.opts.headers['Accept-Profile']==='grceri'));
});
test('catalog fails visibly when Personal is unavailable, not silently stale',async()=>{await assert.rejects(loadPersonalCatalog(new AbortController().signal,async()=>({ok:false})),/configuration unavailable/);});
