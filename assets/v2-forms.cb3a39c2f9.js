TPLS["carousel"] = "<div class=\"crs dm\">\n  <div class=\"dm-main\">\n    <div class=\"crs-c panel\" data-type=\"variants\" role=\"region\" aria-roledescription=\"carousel\" aria-label=\"Cover image drafts\">\n      <div class=\"crs-h\">\n        <div class=\"crs-t\"><b>Cover image drafts</b><span class=\"muted crs-sub\">Making 4 variants</span></div>\n        <button class=\"pill line crs-nav crs-prev\" aria-label=\"Previous variant\" data-tip=\"Previous\">{chev-l}</button><button class=\"pill line crs-nav crs-next\" aria-label=\"Next variant\" data-tip=\"Next\">{chev-r}</button>\n      </div>\n      <div class=\"crs-tr\" role=\"group\" tabindex=\"0\" aria-label=\"Variants. Enter keeps the one in view\"></div>\n      <div class=\"crs-dots\"></div>\n      <p class=\"crs-sr\" aria-live=\"polite\"></p>\n    </div>\n    <div class=\"crs-c\" data-type=\"images\" role=\"region\" aria-roledescription=\"carousel\" aria-label=\"Gallery\" hidden>\n      <div class=\"crs-h\"><button class=\"pill line crs-nav crs-prev\" aria-label=\"Previous picture\" data-tip=\"Previous\">{chev-l}</button><button class=\"pill line crs-nav crs-next\" aria-label=\"Next picture\" data-tip=\"Next\">{chev-r}</button></div>\n      <div class=\"crs-tr\" role=\"group\" tabindex=\"0\" aria-label=\"Pictures\"></div>\n      <div class=\"crs-dots\"></div>\n      <p class=\"crs-sr\" aria-live=\"polite\"></p>\n    </div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Type\"><button aria-pressed=\"true\" data-v=\"variants\">Variants</button><button aria-pressed=\"false\" data-v=\"images\">Images</button></div></div>\n</div>";
TPLS["payment-form"] = "<div class=\"pyx-wrap\"><form class=\"pyx panel\" novalidate>\n  <div class=\"pyx-h\"><div><b>Pro plan</b><span class=\"muted\">For growing design teams</span></div><div class=\"seg2 pyx-per\" role=\"group\" aria-label=\"Billing\"><button type=\"button\" aria-pressed=\"false\" data-v=\"m\">Monthly</button><button type=\"button\" aria-pressed=\"true\" data-v=\"y\">Yearly</button></div></div>\n  <label class=\"pyx-f\"><span>Card number</span><div class=\"pyx-in\"><input class=\"pyx-cn\" inputmode=\"numeric\" placeholder=\"1234 1234 1234 1234\" autocomplete=\"off\"><span class=\"pyx-br\"></span></div></label>\n  <div class=\"pyx-2\"><label class=\"pyx-f\"><span>Expiry</span><div class=\"pyx-in\"><input class=\"pyx-ex\" inputmode=\"numeric\" placeholder=\"MM / YY\" autocomplete=\"off\"></div></label><label class=\"pyx-f\"><span>CVC</span><div class=\"pyx-in\"><input class=\"pyx-cv\" inputmode=\"numeric\" placeholder=\"123\" maxlength=\"4\" autocomplete=\"off\"></div></label></div>\n  <div class=\"pyx-sum\"><div><span>3 editors × <span class=\"num pyx-u\">$24</span></span><span class=\"num pyx-s\">$72.00</span></div><div class=\"pyx-dc\"><span>Yearly discount</span><span class=\"num pyx-d\">−$14.40</span></div><div class=\"pyx-t\"><b>Due today</b><b class=\"num pyx-tot\">$691.20</b></div></div>\n  <button class=\"pill accent pyx-go\" type=\"submit\">{lock}Pay <span class=\"num pyx-gt\">$691.20</span></button>\n</form>\n  <span class=\"muted pyx-n pyx-out\">Demo only. Nothing is charged.</span></div>";
TPLS["form"] = "<form class=\"fmx panel\" novalidate>\n  <div class=\"fmx-h\"><b>New project brief</b><button type=\"button\" class=\"pill soft sm fmx-ai\">{spark}Draft with agent</button></div>\n  <label class=\"fmx-f\"><span>Project name<i class=\"fmx-dr\" aria-hidden=\"true\">{spark}Drafted</i></span><input name=\"n\" placeholder=\"Pricing refresh\" maxlength=\"40\"><em class=\"fmx-c num\">0/40</em></label>\n  <label class=\"fmx-f\"><span>Goal<i class=\"fmx-dr\" aria-hidden=\"true\">{spark}Drafted</i></span><textarea name=\"g\" rows=\"2\" placeholder=\"What should change, and why?\"></textarea></label>\n  <div class=\"fmx-f\"><span>Type</span><div class=\"fmx-ty\"><button type=\"button\" class=\"chip sm\" data-v=\"web\">Website</button><button type=\"button\" class=\"chip sm\" data-v=\"app\">App</button><button type=\"button\" class=\"chip sm\" data-v=\"brand\">Brand</button></div></div>\n  <label class=\"fmx-f\"><span>Due<i class=\"fmx-dr\" aria-hidden=\"true\">{spark}Drafted</i></span><input name=\"d\" type=\"text\" placeholder=\"Nov 14\"></label>\n  <div class=\"fmx-ft\"><span class=\"fmx-ms muted\"></span><button class=\"pill primary sm fmx-go\" type=\"submit\">Create brief</button></div>\n</form>";
TPLS["otp-field"] = "<div class=\"otp panel\">\n  <span class=\"otp-ic\">{mail}</span>\n  <b class=\"otp-t\">Check your email</b>\n  <p class=\"muted otp-s\">Enter the 6-digit code we sent to maya@designme.studio</p>\n  <div class=\"otp-in\" role=\"group\" aria-label=\"Verification code\"></div>\n  <p class=\"otp-m\" aria-live=\"polite\"></p>\n  <p class=\"muted otp-f\"><span class=\"otp-rs\">Resend code in <span class=\"num\">0:30</span></span></p>\n</div>";
TPLS["sign-in"] = "<div class=\"sgx panel\">\n  <div class=\"sgx-st sgx-1\">\n    <b>Sign in</b><span class=\"muted\">We will email you a code</span>\n    <label class=\"sgx-f\"><span>Email</span><input type=\"email\" class=\"sgx-em\" placeholder=\"you@studio.com\" autocomplete=\"off\"></label>\n    <span class=\"sgx-err\"></span>\n    <button class=\"pill primary sgx-go\">Send code</button>\n  </div>\n  <div class=\"sgx-st sgx-2\" hidden>\n    <div class=\"fold shut sgx-ntf\"><div><div class=\"sgx-nt\" role=\"status\"><span class=\"sgx-ni\">{mail}</span><span class=\"t\"><b>Designme <span class=\"muted\">now</span></b><span>Your sign-in code is <span class=\"num\">482 157</span></span></span><button class=\"pill sm sgx-cp\">Copy code</button></div></div></div>\n    <button class=\"sgx-bk\">{l}<span class=\"sgx-to\"></span></button>\n    <b>Check your inbox</b><span class=\"muted\">Enter the 6 digit code</span>\n    <div class=\"sgx-code\"></div>\n    <span class=\"muted sgx-rs\">Resend in <span class=\"num\">30</span>s · <span class=\"sgx-hint\">Copy it from the email above</span></span>\n  </div>\n</div>";
TPLS["social-signin"] = "<div class=\"ssi panel\">\n  <div class=\"ssi-h\"><span class=\"ssi-lg\"><svg viewBox=\"-20 -83 799 799\" aria-hidden=\"true\" class=\"logo\"><path d=\"M149.497 283.784C149.477 284.047 149.474 284.311 149.487 284.575C156.385 340.034 183.548 391.116 225.9 428.196C267.989 465.044 322.188 485.532 378.414 485.855L379.743 485.859C436.453 485.868 491.188 465.353 533.619 428.212C575.912 391.194 603.062 340.216 610.018 284.856L610.018 281.512C610.008 277.337 608.324 273.315 605.303 270.335C602.277 267.351 598.155 265.656 593.837 265.656L165.647 265.656C161.338 265.656 157.226 267.349 154.21 270.331C151.198 273.309 149.524 277.326 149.523 281.491L149.523 283.437L149.497 283.784ZM114.378 247.395C118.396 247.391 122.254 245.919 125.214 243.29C128.063 240.759 129.887 237.33 130.396 233.629L130.396 233.35L130.437 232.917C136.355 171.634 165.162 114.754 211.202 73.3687C257.239 31.9859 317.206 9.06063 379.393 9.04448L379.396 9.04448C441.593 9.04583 501.574 31.964 547.624 73.3482C593.677 114.735 622.491 171.624 628.411 232.917L628.453 233.35L628.453 233.643C628.953 237.344 630.773 240.774 633.621 243.304C636.58 245.932 640.437 247.399 644.452 247.395L725.644 247.395C728.882 247.404 732.089 248.06 735.071 249.329C738.055 250.598 740.753 252.453 743.001 254.787C745.252 257.123 747.005 259.891 748.151 262.924C749.296 265.954 749.81 269.183 749.662 272.418L749.663 272.418C745.484 366.797 704.617 455.919 635.615 521.211C566.616 586.499 474.809 622.924 379.338 622.924C283.872 622.924 192.071 586.496 123.081 521.206C54.0935 455.917 13.2412 366.804 9.07133 272.438L9.07036 272.438L9.07036 272.436C9.07007 272.43 9.06967 272.423 9.06938 272.417L9.07036 272.417C8.92272 269.182 9.43655 265.953 10.5811 262.924C11.7276 259.89 13.481 257.123 15.7315 254.787C17.9805 252.452 20.6797 250.597 23.6622 249.329C26.6443 248.06 29.8504 247.404 33.0889 247.395L114.378 247.395Z\" fill=\"currentColor\" /></svg></span><b>Sign in to DesignMe</b></div>\n  <div class=\"ssi-list\"></div>\n  <div class=\"ssi-or\">or</div>\n  <button class=\"ssi-mail\">Continue with email</button>\n</div>";
TPLS["color-picker"] = "<div class=\"cpk panel\">\n  <div class=\"cpk-sv\"><span class=\"cpk-k\" role=\"slider\" tabindex=\"0\" aria-label=\"Saturation and brightness\" aria-valuemin=\"0\" aria-valuemax=\"100\"></span></div>\n  <div class=\"cpk-rail cpk-hue\"><span class=\"cpk-k\" role=\"slider\" tabindex=\"0\" aria-label=\"Hue\" aria-valuemin=\"0\" aria-valuemax=\"359\"></span></div>\n  <div class=\"cpk-rail cpk-al\"><i></i><span class=\"cpk-k\" role=\"slider\" tabindex=\"0\" aria-label=\"Opacity\" aria-valuemin=\"0\" aria-valuemax=\"100\"></span></div>\n  <div class=\"cpk-row\">\n    <span class=\"cpk-pv\" aria-hidden=\"true\"><i></i></span>\n    <label class=\"cpk-hx\"><span class=\"muted\">#</span><input class=\"num\" spellcheck=\"false\" autocomplete=\"off\" maxlength=\"7\" aria-label=\"Hex colour\"></label>\n    <span class=\"cpk-a num muted\"></span>\n  </div>\n  <div class=\"cpk-sw\" role=\"group\" aria-label=\"Swatches\"></div>\n  <div class=\"cpk-cr\" aria-live=\"polite\"><div class=\"cpk-ln\" data-on=\"#ffffff\"><span class=\"cpk-aa\">Aa</span><span class=\"t\">White text</span><span class=\"num r\"></span><span class=\"tag\"></span></div><div class=\"cpk-ln\" data-on=\"ink\"><span class=\"cpk-aa\">Aa</span><span class=\"t\">Ink text</span><span class=\"num r\"></span><span class=\"tag\"></span></div></div>\n  <div class=\"cpk-act\"><button class=\"pill sm cpk-fix\">{wand}Suggest an accessible shade</button><button class=\"pill ghost sm cpk-mk\">{layers}Make a scale</button></div>\n  <div class=\"cpk-sc\" role=\"group\" aria-label=\"Scale\"></div>\n  <p class=\"cpk-sr\" aria-live=\"polite\"></p>\n</div>";
TPLS["multi-select"] = "<div class=\"msc\">\n  <div class=\"msc-top\"><label class=\"msc-l\">Tags</label><button class=\"msc-clr\" hidden>Clear all</button></div>\n  <div class=\"msc-f\"><input class=\"msc-q\" role=\"combobox\" aria-expanded=\"false\" aria-autocomplete=\"list\" aria-haspopup=\"listbox\" placeholder=\"Add a tag\" spellcheck=\"false\" autocomplete=\"off\"><span class=\"kbd msc-key\" aria-hidden=\"true\"></span></div>\n  <div class=\"msc-pop\"><div class=\"msc-list\" role=\"listbox\" aria-multiselectable=\"true\" aria-label=\"Tags\"></div></div>\n  <span class=\"muted msc-h\">Type to filter. Backspace removes the last tag.</span>\n</div>";
TPLS["country-select"] = "<div class=\"csx\">\n  <label class=\"csx-l\">Billing country</label>\n  <button class=\"csx-f\" aria-haspopup=\"listbox\" aria-expanded=\"false\"><span class=\"csx-fl\"></span><span class=\"csx-v\"></span>{chev}</button>\n  <div class=\"csx-pop\"><input class=\"csx-q\" placeholder=\"Search countries\" aria-label=\"Search countries\" spellcheck=\"false\"><div class=\"csx-list\" role=\"listbox\"></div></div>\n  <span class=\"muted csx-h\">Used for tax and currency</span>\n</div>";
TPLS["search-input"] = "<div class=\"six\">\n  <div class=\"six-box\">\n    <div class=\"six-in\">{search}<span class=\"six-chips\"></span><input placeholder=\"Search frames, files and docs\" aria-label=\"Search\" spellcheck=\"false\"><span class=\"kbd six-k\">⌘K</span><button class=\"ib six-x\" aria-label=\"Clear\" hidden>{x}</button></div>\n    <div class=\"fold shut six-dd\"><div><div class=\"six-res\"></div></div></div>\n  </div>\n</div>";
TPLS["tooltip"] = "<div class=\"ttp\">\n  <div class=\"ttp-bar panel\">\n    <button class=\"ib\" aria-label=\"Undo\" data-tip=\"Undo\" data-tip-k=\"⌘Z\">{undo}</button>\n    <button class=\"ib\" aria-label=\"Comment\" data-tip=\"Comment\" data-tip-k=\"C\">{chat}</button>\n    <button class=\"ib\" aria-label=\"Ask agent\" data-tip=\"Ask the agent\" data-tip-k=\"⌘J\">{spark}</button>\n    <span class=\"ttp-sep\"></span>\n    <button class=\"ib\" aria-label=\"Share\" data-tip=\"Share with your team\">{users}</button>\n    <span class=\"ttp-sep\"></span>\n    <span class=\"ttp-avs\"><button class=\"ttp-av\" data-card=\"0\">{a1}</button><button class=\"ttp-av\" data-card=\"1\">{a2}</button></span>\n  </div>\n  <div class=\"ttp-card panel\"><div class=\"ttp-ci\"></div></div>\n  <p class=\"muted ttp-n\">Labels wait a moment, then follow you instantly between buttons.</p>\n</div>";
TPLS["slider"] = "<div class=\"sdx panel\">\n  <div class=\"sdx-b\">\n    <div class=\"sdx-h\"><span id=\"sdx-cr\">Creativity</span><span class=\"sdx-v num\"></span></div>\n    <div class=\"sdx-tr\" data-s=\"cr\"><span class=\"sdx-rail\"><i class=\"sdx-fill\"></i></span><button class=\"sdx-rec\" aria-label=\"Use the recommended value\" data-tip=\"Recommended by the agent: 0.4\">{spark}</button><span class=\"sdx-k\" role=\"slider\" tabindex=\"0\" aria-labelledby=\"sdx-cr\"><i class=\"sdx-kb\"></i><span class=\"sdx-tt num\"></span></span></div>\n    <div class=\"sdx-stops\"><button data-v=\"0\">Precise</button><button data-v=\"0.5\">Balanced</button><button data-v=\"1\">Creative</button></div>\n    <p class=\"sdx-sm\" aria-live=\"polite\"><span></span></p>\n  </div>\n  <div class=\"sdx-b\">\n    <div class=\"sdx-h\"><span id=\"sdx-mx\">Tool calls per run</span><span class=\"sdx-v num\"></span></div>\n    <div class=\"sdx-tr\" data-s=\"mx\"><span class=\"sdx-rail\"><i class=\"sdx-fill\"></i></span><span class=\"sdx-k\" role=\"slider\" tabindex=\"0\" aria-labelledby=\"sdx-mx\"><i class=\"sdx-kb\"></i><span class=\"sdx-tt num\"></span></span></div>\n    <div class=\"sdx-ticks num\"></div>\n  </div>\n  <div class=\"sdx-b\">\n    <div class=\"sdx-h\"><span id=\"sdx-co\">Cost per run</span><span class=\"sdx-v num\"></span></div>\n    <div class=\"sdx-tr\" data-s=\"co\"><span class=\"sdx-rail\"><i class=\"sdx-fill\"></i></span><span class=\"sdx-k\" role=\"slider\" tabindex=\"0\" aria-label=\"Lowest cost per run\"><i class=\"sdx-kb\"></i><span class=\"sdx-tt num\"></span></span><span class=\"sdx-k\" role=\"slider\" tabindex=\"0\" aria-label=\"Highest cost per run\"><i class=\"sdx-kb\"></i><span class=\"sdx-tt num\"></span></span></div>\n    <div class=\"sdx-ends muted num\"><span>$0.00</span><span>$1.00</span></div>\n  </div>\n</div>";
TPLS["progress"] = "<div class=\"dm prg-dm\" data-designs=\"card\"><div class=\"dm-main\"><div class=\"prg panel\" data-s=\"ind\">\n  <div class=\"prg-h\">\n    <span class=\"prg-ring\" role=\"progressbar\" aria-label=\"Run progress\"><svg viewBox=\"0 0 36 36\" aria-hidden=\"true\"><circle class=\"tr\" cx=\"18\" cy=\"18\" r=\"15\"/><circle class=\"fl\" cx=\"18\" cy=\"18\" r=\"15\" pathLength=\"100\"/></svg><span class=\"prg-pc num\"></span></span>\n    <div class=\"prg-t\"><b>Indexing the docs</b><span class=\"muted prg-vt\">Preparing the run</span></div>\n    <span class=\"tag prg-st\">Starting</span>\n    <button class=\"ib prg-btn\" aria-label=\"Pause\" data-tip=\"Pause\">{pause}</button>\n  </div>\n  <div class=\"prg-seg\" role=\"progressbar\" aria-label=\"Steps\" aria-valuemin=\"0\" aria-valuemax=\"5\"><i><b></b></i><i><b></b></i><i><b></b></i><i><b></b></i><i><b></b></i></div>\n  <div class=\"prg-ll\"></div>\n  <div class=\"prg-lin ind\" role=\"progressbar\" aria-label=\"This step\" aria-valuemin=\"0\" aria-valuemax=\"100\"><i></i></div>\n  <div class=\"prg-meter\">\n    <div class=\"prg-mh\"><span>Credits this month</span><span class=\"num muted\"><b class=\"prg-mv\">0</b> of 10,000</span></div>\n    <div class=\"prg-mb\" role=\"meter\" aria-label=\"Credits used\" aria-valuemin=\"0\" aria-valuemax=\"10000\"><i class=\"fl\"></i><i class=\"th\" style=\"left:75%\"></i><i class=\"th\" style=\"left:90%\"></i></div>\n    <div class=\"prg-ml\"><span class=\"prg-mw\"></span><span class=\"muted\">Resets Dec 1</span></div>\n  </div>\n  <p class=\"prg-sr\" aria-live=\"polite\"></p>\n</div></div>\n<div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Progress design\"><button aria-pressed=\"true\" data-v=\"compact\">Compact</button><button aria-pressed=\"false\" data-v=\"steps\">Steps</button><button aria-pressed=\"false\" data-v=\"budget\">Budget</button></div></div>\n</div>";
TPLS["badge"] = "<div class=\"bdx\">\n  <div class=\"bdx-row\"><span class=\"bdx-l muted\">Tones</span><div class=\"bdx-set\"><span class=\"bdg\">Draft</span><span class=\"bdg\" data-tone=\"accent\">Beta</span><span class=\"bdg\" data-tone=\"success\">Live</span><span class=\"bdg\" data-tone=\"warning\">Degraded</span><span class=\"bdg\" data-tone=\"danger\">Failed</span></div></div>\n  <div class=\"bdx-row\"><span class=\"bdx-l muted\">Colours</span><div class=\"bdx-set\"><span class=\"bdg\" data-tone=\"blue\">Search</span><span class=\"bdg\" data-tone=\"violet\">Reasoning</span><span class=\"bdg\" data-tone=\"green\">Data</span><span class=\"bdg\" data-tone=\"orange\">Billing</span><span class=\"bdg\" data-tone=\"red\">Urgent</span><span class=\"bdg\" data-tone=\"yellow\">Review</span><span class=\"bdg\" data-tone=\"pink\">Design</span><span class=\"bdg\" data-tone=\"teal\">Ops</span></div></div>\n  <div class=\"bdx-row\"><span class=\"bdx-l muted\">Sizes</span><div class=\"bdx-set\"><span class=\"bdg sm\" data-tone=\"accent\">Pro</span><span class=\"bdg\" data-tone=\"accent\">Pro</span></div></div>\n  <div class=\"bdx-row\"><span class=\"bdx-l muted\">Dot or icon</span><div class=\"bdx-set\"><span class=\"bdg live\" data-tone=\"success\"><span class=\"bdg-dot\"></span>Running</span><span class=\"bdg\"><span class=\"bdg-dot\"></span>Idle</span><span class=\"bdg\">{lock}Private</span><span class=\"bdg\" data-tone=\"accent\">{spark}Agent</span></div></div>\n  <div class=\"bdx-row\"><span class=\"bdx-l muted\">Removable</span><div class=\"bdx-set bdx-rm\"><span class=\"bdg\" data-tone=\"warning\"><span class=\"t\">Production</span><button class=\"bdg-x\" aria-label=\"Remove Production\">{x}</button></span><span class=\"bdg\" data-tone=\"blue\"><span class=\"t\">Staging</span><button class=\"bdg-x\" aria-label=\"Remove Staging\">{x}</button></span><span class=\"bdg\" data-tone=\"violet\"><span class=\"t\">Preview</span><button class=\"bdg-x\" aria-label=\"Remove Preview\">{x}</button></span><button class=\"pill ghost sm bdx-undo\" hidden>Undo</button></div></div>\n  <p class=\"bdx-live\" aria-live=\"polite\"></p>\n</div>";
TPLS["buttons"] = "<div class=\"btx\">\n  <div class=\"btx-row\"><span class=\"btx-l muted\">Styles</span><button class=\"pill accent btx-trial\">Start free trial</button><button class=\"pill primary btx-run\">Run agent</button><button class=\"pill soft btx-pv\" aria-pressed=\"false\">Preview</button><button class=\"pill line btx-share\" data-pop=\".btx-sp\" aria-haspopup=\"menu\">Share</button><div class=\"pop btx-sp\" role=\"menu\"><button class=\"mi\" role=\"menuitem\" data-close data-a=\"link\">{link}Copy link</button><button class=\"mi\" role=\"menuitem\" data-close data-a=\"slack\">{slack}Send to Slack<span class=\"r\">#design</span></button><button class=\"mi\" role=\"menuitem\" data-close data-a=\"pdf\">{down}Export as PDF</button></div><button class=\"pill ghost\">Cancel</button></div>\n  <div class=\"btx-row\"><span class=\"btx-l muted\">With icon</span><button class=\"pill accent btx-ask\">{spark}Ask agent</button><button class=\"pill soft btx-fig\">{figma}Open in Figma</button><button class=\"ib fill btx-icp\" aria-label=\"Copy\" data-tip=\"Copy\">{copy}</button><button class=\"ib fill btx-more\" aria-label=\"More\" data-tip=\"More\" data-pop=\".btx-mp\" data-pop-align=\"end\" aria-haspopup=\"menu\">{more}</button><div class=\"pop btx-mp\" role=\"menu\"><button class=\"mi\" role=\"menuitem\" data-close data-a=\"Duplicated\">{dup}Duplicate<span class=\"r\">⌘D</span></button><button class=\"mi\" role=\"menuitem\" data-close data-a=\"Renamed\">{edit}Rename</button><button class=\"mi\" role=\"menuitem\" data-close data-a=\"Moved to Website\">{folder}Move to…</button><div class=\"sep\"></div><button class=\"mi del\" role=\"menuitem\" data-close data-a=\"Moved to trash\">{bin}Delete<span class=\"r\">⌫</span></button></div></div>\n  <div class=\"btx-row\"><span class=\"btx-l muted\">States</span><button class=\"pill primary btx-load\">Publish</button><button class=\"pill soft btx-copy\">{copy}Copy link</button><button class=\"pill btx-hold\"><span class=\"fill\"></span><span class=\"lb\">{trash}Hold to delete</span></button><button class=\"pill accent\" disabled>Disabled</button></div>\n  <div class=\"btx-row\"><span class=\"btx-l muted\">Sizes</span><button class=\"pill accent sm\">Small</button><button class=\"pill accent\">Default</button><button class=\"pill accent btx-lg\">Large</button></div>\n</div>";

/* ---------- Buttons ---------- */
DM.def('buttons', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{link}', I('link','s')).replace('{slack}', BRAND.slack).replace('{down}', I('down','s')).replace('{spark}', I('spark','xs')).replace('{figma}', I('figma','xs')).replace(/\{copy\}/g, (m, o) => I('copy','xs')).replace('{more}', I('more','xs')).replace('{trash}', I('trash','xs')).replace('{bin}', I('trash','s')).replace('{dup}', I('copy','s')).replace('{edit}', I('edit','s')).replace('{folder}', I('folder','s'));
  const ld = $('.btx-load', r);
  /* busy buttons keep their colour; disabled styling is only for buttons you can't use */
  ld.onclick = () => c.run(async () => { if (ld._busy) return; ld._busy = true; ld.classList.add('busy'); ld.setAttribute('aria-busy', 'true'); ld.innerHTML = '<span class="spin"></span>Publishing'; await c.wait(1300); ld.classList.remove('busy'); ld.classList.add('ok'); ld.innerHTML = I('check','xs') + 'Published'; enter(ld.firstChild); await c.wait(1800); ld.classList.remove('ok'); ld.textContent = 'Publish'; ld._busy = false; ld.removeAttribute('aria-busy'); });
  const ask = $('.btx-ask', r);
  ask.onclick = () => c.run(async () => { if (ask._busy) return; ask._busy = true; ask.classList.add('busy'); ask.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Agent is working</span>';
    await c.wait(2200); ask.classList.remove('busy'); ask.classList.add('done'); ask.innerHTML = I('check','xs') + 'Draft ready'; enter(ask.firstChild);
    await c.wait(1800); ask.classList.remove('done'); ask.innerHTML = I('spark','xs') + 'Ask agent'; ask._busy = false; });
  const icp = $('.btx-icp', r); icp.onclick = () => copied(icp, 'https://designme.dev/p/pricing');
  /* Start free trial: a short wait, then a confirmed state */
  const tr = $('.btx-trial', r);
  tr.onclick = () => c.run(async () => { if (tr._busy) return; tr._busy = true; tr.setAttribute('aria-busy', 'true'); tr.innerHTML = '<span class="spin"></span>Starting'; await c.wait(1100); tr.innerHTML = I('check','xs') + 'Trial started'; enter(tr.firstChild); await c.wait(1800); swap(tr, 'Start free trial'); tr._busy = false; tr.removeAttribute('aria-busy'); });
  /* Run agent: shows the run time, turns into Stop while you hover it */
  const rn = $('.btx-run', r); let rt = 0, rtick = null, rdone = null;
  const idle = () => { clearInterval(rtick); clearTimeout(rdone); rn.classList.remove('busy'); rn.removeAttribute('aria-busy'); rn._run = false; };
  const rlabel = () => { if (!rn._run) return; rn.innerHTML = rn.matches(':hover') ? '<span class="sq"></span>Stop' : `<span class="spin"></span>Running <span class="num">${Math.floor(rt / 60)}:${String(rt % 60).padStart(2, '0')}</span>`; };
  rn.onclick = () => {
    if (rn._run){ idle(); rn.innerHTML = '<span class="sq"></span>Stopped'; c.later(1200, () => { if (!rn._run) swap(rn, 'Run agent'); }); return; }
    rn._run = true; rt = 0; rn.classList.add('busy'); rn.setAttribute('aria-busy', 'true'); rlabel();
    rtick = setInterval(() => { rt++; rlabel(); }, 1000);
    rdone = setTimeout(() => { idle(); rn.innerHTML = I('check','xs') + 'Run complete'; enter(rn.firstChild); c.later(1800, () => { if (!rn._run) swap(rn, 'Run agent'); }); }, 3200);
  };
  rn.onmouseenter = rlabel; rn.onmouseleave = rlabel;
  c.offs.push(idle);
  /* Preview: a toggle, live while it is on */
  const pv = $('.btx-pv', r);
  pv.onclick = () => { const on = pv.getAttribute('aria-pressed') !== 'true'; pv.setAttribute('aria-pressed', on); pv.innerHTML = on ? '<span class="btx-live"></span>Previewing' : 'Preview'; };
  /* Share: a small menu, the button says what happened */
  const sh = $('.btx-share', r);
  const said = (t, ms = 1600) => { sh.innerHTML = I('check','xs') + t; enter(sh.firstChild); clearTimeout(sh._t); sh._t = setTimeout(() => swap(sh, 'Share'), ms); };
  $$('.btx-sp .mi', r).forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.a;
    if (a === 'link'){ try { navigator.clipboard.writeText('https://designme.dev/p/pricing').catch(() => {}); } catch(e){} said('Link copied'); }
    else if (a === 'slack') said('Sent to #design');
    else { clearTimeout(sh._t); sh.innerHTML = '<span class="spin"></span>Exporting'; sh._t = setTimeout(() => said('PDF ready'), 1100); }
  }));
  c.offs.push(() => clearTimeout(sh._t));
  /* Open in Figma: a short wait while it opens, then it says where it went */
  const fg = $('.btx-fig', r);
  fg.onclick = () => c.run(async () => { if (fg._busy) return; fg._busy = true; fg.setAttribute('aria-busy', 'true'); fg.innerHTML = '<span class="spin"></span>Opening'; await c.wait(900);
    fg.innerHTML = I('ext','xs') + 'Opened in Figma'; enter(fg.firstChild); await c.wait(1800); swap(fg, I('figma','xs') + 'Open in Figma', true); await c.wait(200); fg._busy = false; fg.removeAttribute('aria-busy'); });
  /* More: a menu of actions; the button flashes a check and says what happened */
  const mo = $('.btx-more', r), moIc = mo.innerHTML;
  // no tooltip over its own open menu
  const mob = new MutationObserver(() => { if (mo.getAttribute('aria-expanded') === 'true'){ if (tipFor === mo) hideTip(true); delete mo.dataset.tip; } else if (!mo.classList.contains('done')) mo.dataset.tip = 'More'; });
  mob.observe(mo, { attributes:true, attributeFilter:['aria-expanded'] }); c.offs.push(() => mob.disconnect());
  $$('.btx-mp .mi', r).forEach(b => b.addEventListener('click', () => {
    clearTimeout(mo._t); c.later(140, () => { mo.innerHTML = I('check','xs'); mo.classList.add('done'); mo.dataset.tip = b.dataset.a; showTip(mo);
      mo._t = setTimeout(() => { mo.innerHTML = moIc; mo.classList.remove('done'); mo.dataset.tip = 'More'; if (tipFor === mo) hideTip(true); }, 1500); });
  }));
  c.offs.push(() => clearTimeout(mo._t));
  const cp = $('.btx-copy', r);
  cp.onclick = () => { copied(cp, 'https://designme.dev/p/pricing'); const t = cp.lastChild; t.textContent = 'Copied'; clearTimeout(cp._lt); cp._lt = setTimeout(() => { t.textContent = 'Copy link'; }, 1600); };
  const h = $('.btx-hold', r), lb = $('.lb', h); let t;
  // the label crossfades to Keep holding by hand, so an early release can cancel it before the text lands
  const start = e => { if (h.classList.contains('done')) return; h.classList.add('h'); lb.classList.add('sw', 'out'); clearTimeout(h._sw); h._sw = setTimeout(() => { lb.textContent = 'Keep holding'; lb.classList.remove('out'); }, REDUCE ? 0 : 170); t = setTimeout(() => { h.classList.remove('h'); h.classList.add('done'); lb.innerHTML = I('check','xs') + 'Deleted'; c.later(1800, () => { h.classList.remove('done'); lb.innerHTML = I('trash','xs') + 'Hold to delete'; }); }, 1200); };
  const end = () => { if (!h.classList.contains('h')) return; clearTimeout(t); clearTimeout(h._sw); lb.classList.remove('out'); h.classList.remove('h'); lb.innerHTML = I('trash','xs') + 'Hold to delete'; };
  h.onpointerdown = start; h.onpointerup = end; h.onpointerleave = end;
  h.onkeydown = e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat){ e.preventDefault(); start(); } };
  h.onkeyup = e => { if (e.key === ' ' || e.key === 'Enter') end(); }; h.onblur = end;
  c.offs.push(() => { clearTimeout(t); clearTimeout(h._sw); });
});
/* ---------- Badge ---------- */
DM.def('badge', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{lock}', I('lock','xs')).replace('{spark}', I('spark','xs')).replace(/\{x\}/g, I('x','xs'));
  const set = $('.bdx-rm', r), undo = $('.bdx-undo', r), live = $('.bdx-live', r);
  // the rows sit centred in their stage whatever the badges wrap to, and glide back to the middle as a remove or Undo
  // changes a row's height
  const box = $('.bdx', r); centre(c, box, () => box.offsetHeight);
  const label = b => $('.t', b).textContent;
  // each removable badge keeps its place in the row, so Undo puts it back where it was
  $$('.bdg', set).forEach((b, i) => { b.dataset.i = i; });
  // the badges taken off, the latest last
  const gone = [];
  // a remove button first sends a cancelable badge-remove event from its badge, so your code can keep it or act on it
  function remove(b){
    if (b.classList.contains('go')) return;
    if (!b.dispatchEvent(new CustomEvent('badge-remove', { bubbles:true, cancelable:true, detail:{ label:label(b) } }))) return;
    const had = b.contains(document.activeElement), all = $$('.bdg:not(.go)', set), i = all.indexOf(b), next = all[i + 1] || all[i - 1];
    gone.push(b); live.textContent = `Removed ${label(b)}`;
    // the focus goes on to the next badge's remove button, or to Undo once none is left
    // the badges after it slide into its place rather than jumping there (owner, 10 Nov)
    const done = () => {
      const sib = $$('.bdg', set).filter(x => x !== b), was = new Map(sib.map(x => [x, x.getBoundingClientRect()]));
      b.remove(); b.classList.remove('go'); const fresh = undo.hidden; undo.hidden = false;
      if (!REDUCE){ sib.forEach(x => { const o = was.get(x), n = x.getBoundingClientRect(), dx = o.left - n.left, dy = o.top - n.top;
          if (dx || dy) x.animate([{ transform:`translate(${dx}px,${dy}px)` }, { transform:'none' }], { duration:300, easing:'cubic-bezier(.22,.8,.24,1)' }); });
        if (fresh) undo.animate([{ opacity:0, transform:'translateX(-6px)' }, { opacity:1, transform:'none' }], { duration:260, delay:80, easing:'ease-out', fill:'backwards' }); }
      if (had) ((next && next.isConnected && $('.bdg-x', next)) || undo).focus({ preventScroll:true });
    };
    if (REDUCE) done(); else { b.classList.add('go'); c.later(220, done); }
  }
  function restore(){
    const b = gone.pop(); if (!b) return;
    const had = undo === document.activeElement, after = $$('.bdg', set).find(x => +x.dataset.i > +b.dataset.i);
    set.insertBefore(b, after || undo);
    b.classList.remove('pop-in'); void b.offsetWidth; b.classList.add('pop-in');
    undo.hidden = !gone.length; live.textContent = `${label(b)} is back`;
    if (had && undo.hidden) $('.bdg-x', b).focus({ preventScroll:true });
  }
  set.addEventListener('click', e => { const x = e.target.closest('.bdg-x'); if (x) remove(x.closest('.bdg')); });
  undo.onclick = restore;
  // the preview's story: take Staging off, then put it back with Undo
  c.story(async s => {
    await s.beat(4);
    const b = $$('.bdg', set).find(x => label(x) === 'Staging'); if (!b) return;
    await s.tap($('.bdg-x', b)); s.away(); await s.beat(4);
    await s.tap(undo); s.away(); await s.beat(4);
  });
});
/* ---------- Tooltip ---------- */
DM.def('tooltip', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{undo}', I('undo')).replace('{chat}', I('edit')).replace('{spark}', I('spark')).replace('{users}', I('users')).replace('{a1}', AV('MK','var(--av-l)')).replace('{a2}', AV('DA','var(--av-b)'));
  const P = [['MK','var(--av-l)','Maya Kim','Design lead','Editing Pricing, frame 2'],['DA','var(--av-b)','Design agent','Working for Maya','Auditing contrast, 2 of 6 checks']];
  const card = $('.ttp-card', r), ci = $('.ttp-ci', r), root = $('.ttp', r); let t;
  $$('.ttp-av', r).forEach(b => { b.onmouseenter = () => { clearTimeout(t); t = setTimeout(() => { const p = P[+b.dataset.card];
      ci.innerHTML = `<div class="ttp-ch">${AV(p[0], p[1])}<div><b>${p[2]}</b><span>${p[3]}</span></div></div><div class="ttp-cs">${p[0] === 'DA' ? '<span class="think on" style="color:var(--accent-mark,var(--accent))"><i></i><i></i><i></i><i></i></span>' : '<span class="dot"></span>'}${p[4]}</div>`;
      const rr = root.getBoundingClientRect(), br = b.getBoundingClientRect(); let x = br.left - rr.left + br.width / 2 - 115; x = Math.max(0, Math.min(x, rr.width - 230));
      card.style.left = x + 'px'; card.style.top = (br.bottom - rr.top + 10) + 'px'; card.classList.add('show'); }, 300); };
    b.onmouseleave = () => { clearTimeout(t); card.classList.remove('show'); }; });
  c.offs.push(() => clearTimeout(t));
  // once it has entered, it shows what it does: a shortcut tip, then the agent's card. Pointing at it takes over, as does
  // clicking, focusing or typing in it
  // what the demo opened goes when the pointer comes in, unless it is on that very control: the visitor's own hover decides
  // from then on, so no tip or card is left over from the demo over the one they point at
  let touched = false, shown = null;
  c.on(root, 'pointerenter', () => { touched = true;
    if (shown === 'tip' && tipFor && !tipNext && root.contains(tipFor) && !tipFor.matches(':hover')) hideTip();
    if (shown === 'card' && !$('.ttp-av:hover', r)){ clearTimeout(t); card.classList.remove('show'); }
    shown = null; });
  const go = () => { if (touched || c.mine) throw 'stop'; };
  c.run(async () => {
    await c.wait(1300); go(); if (tipFor) return;
    const ask = $('[data-tip-k="⌘J"]', r); showTip(ask); shown = 'tip'; await c.wait(1700); go(); if (tipFor === ask) hideTip(true); shown = null;
    await c.wait(500); go();
    const av = $('.ttp-av[data-card="1"]', r); av.onmouseenter(); shown = 'card'; await c.wait(2600); go(); av.onmouseleave(); shown = null;
  });
});
/* ---------- Search input ---------- */
DM.def('search-input', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{search}', I('search','xs')).replace('{x}', I('x','xs'));
  const box = $('.six-box', r), inp = $('.six-in input', r), dd = $('.six-dd', r), res = $('.six-res', r), chips = $('.six-chips', r), xB = $('.six-x', r), k = $('.six-k', r);
  const ITEMS = [['figma','Pricing v4','Figma'],['figma','Pricing mobile','Figma'],['file-text','Pricing research notes','Notion'],['code','PricingCard.tsx','GitHub'],['figma','Checkout flow','Figma'],['file-text','Brand voice guide','Notion'],['code','tokens.css','GitHub']];
  const SC = { figma:'Figma', notion:'Notion', github:'GitHub' };
  let scope = null, at = null, ans = 0, grow = null, hi = -1;
  res.id = 'six-r-' + Math.random().toString(36).slice(2, 7); res.setAttribute('role', 'listbox'); res.setAttribute('aria-label', 'Suggestions');
  inp.setAttribute('role', 'combobox'); inp.setAttribute('aria-autocomplete', 'list'); inp.setAttribute('aria-expanded', 'false'); inp.setAttribute('aria-controls', res.id);
  // the agent's answer streams in word by word and keeps going while the question is still being typed
  const WS = 'Pricing changed on Sep 18: annual plans first, one CTA per card. Trial to paid is up 8.1 points since.'.split(' ');
  function paint(){
    // the list eases to its new height instead of jumping as the results change
    const h0 = dd.classList.contains('shut') ? 0 : res.offsetHeight; if (grow) grow.cancel();
    const v = inp.value.trim(); xB.hidden = !v && !scope; k.hidden = !!v || !!scope;
    let h = '';
    if (/@\w*$/.test(v)){ const q = v.split('@').pop().toLowerCase(); h = '<div class="six-g">Filter by source</div>' + Object.entries(SC).filter(([key]) => key.startsWith(q)).map(([key, n]) => `<button class="six-it" data-sc="${n}"><span class="ic">${I(key === 'figma' ? 'figma' : key === 'github' ? 'code' : 'file-text','xs')}</span>${n}<span class="d">@${key}</span></button>`).join(''); }
    else if (!v && !scope){ h = '<div class="six-g">Recent</div>' + ['pricing contrast','checkout copy','tokens'].map(q => `<button class="six-it" data-q="${q}"><span class="ic">${I('history','xs')}</span>${q}</button>`).join(''); }
    else {
      const words = v.toLowerCase().split(/[^a-z0-9.]+/).filter(w => w.length > 2 && !['why','did','the','how','what','does'].includes(w)); const hit = i => !v || i[1].toLowerCase().includes(v.toLowerCase()) || words.some(w => i[1].toLowerCase().includes(w));
      const m = ITEMS.filter(i => (!scope || i[2] === scope) && hit(i)); const hw = words.find(w => m.some(i => i[1].toLowerCase().includes(w))) || v;
      if (v.split(' ').length > 2 || v.endsWith('?')) h += `<div class="six-ans">${I('spark','xs')}<span class="six-at"></span></div>`;
      h += m.length ? '<div class="six-g">' + m.length + (m.length === 1 ? ' result' : ' results') + '</div>' + m.map(i => `<button class="six-it"><span class="ic">${I(i[0],'xs')}</span><span>${hw ? i[1].replace(new RegExp(hw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), s => `<mark>${s}</mark>`) : i[1]}</span><span class="d">${i[2]}</span></button>`).join('') : '<div class="six-g">No matches. Press Enter to ask the agent</div>';
    }
    // rows that were showing a moment ago glide to their new places as the answer line comes and goes or the results narrow,
    // new rows and the answer fade in, and rows that no longer match fade where they were, so typing never restarts the list
    reflow(() => [...res.children], () => { res.innerHTML = h; [...res.children].forEach(x => x.dataset.key = x.matches('.six-ans') ? 'ans' : x.matches('.six-g') ? 'g' : x.textContent); }, { root:box });
    hi = -1; inp.removeAttribute('aria-activedescendant');
    $$('.six-it:not([data-ghost])', res).forEach((b, j) => { b.id = res.id + '-' + j; b.setAttribute('role', 'option'); b.setAttribute('aria-selected', 'false'); b.tabIndex = -1; });
    const a = $('.six-ans:not([data-ghost]) .six-at', res);
    if (a){ a.innerHTML = WS.slice(0, ans).map(w => `<span class="w done">${w} </span>`).join('');
      if (!at && ans < WS.length) at = c.every(45, () => { const el = $('.six-ans:not([data-ghost]) .six-at', res); if (!el || ans >= WS.length){ clearInterval(at); at = null; return; } el.insertAdjacentHTML('beforeend', `<span class="w">${WS[ans++]} </span>`); }); }
    else { if (at){ clearInterval(at); at = null; } ans = 0; }
    const h1 = res.offsetHeight;
    if (h0 && h1 !== h0 && !REDUCE) grow = res.animate([{ height:h0 + 'px', boxSizing:'border-box', overflow:'hidden' }, { height:h1 + 'px', boxSizing:'border-box', overflow:'hidden' }], { duration:280, easing:'cubic-bezier(.22,1,.36,1)' });
    $$('.six-it[data-q]', res).forEach(b => b.onmousedown = e => { e.preventDefault(); inp.value = b.dataset.q; paint(); });
    $$('.six-it[data-sc]', res).forEach(b => b.onmousedown = e => { e.preventDefault(); scope = b.dataset.sc; inp.value = inp.value.replace(/@\w*$/, ''); chips.innerHTML = `<span class="six-ch">${scope}<button aria-label="Remove filter">${I('x','xs')}</button></span>`; enter(chips.firstChild); $('button', chips).onmousedown = ev => { ev.preventDefault(); scope = null; chips.innerHTML = ''; paint(); }; paint(); });
  }
  function shut(){ box.classList.remove('f'); dd.classList.add('shut'); inp.setAttribute('aria-expanded', 'false'); }
  const list = () => { dd.classList.remove('shut'); inp.setAttribute('aria-expanded', 'true'); };
  inp.onfocus = () => { box.classList.add('f'); list(); paint(); };
  inp.onblur = shut;
  inp.oninput = () => { list(); paint(); };
  // the box is a combobox for the list under it: up and down move through the rows and wrap, Enter picks the highlighted
  // one, and Escape closes the list, keeping the focus in the box (a second Escape clears it)
  const light = k => { const all = $$('.six-it:not([data-ghost])', res); if (!all.length) return; hi = (k + all.length) % all.length;
    all.forEach((b, j) => { b.classList.toggle('hl', j === hi); b.setAttribute('aria-selected', j === hi); }); inp.setAttribute('aria-activedescendant', all[hi].id); all[hi].scrollIntoView({ block:'nearest' }); };
  inp.onkeydown = e => {
    if (e.key === 'Backspace' && !inp.value && scope){ scope = null; chips.innerHTML = ''; paint(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); if (dd.classList.contains('shut')){ list(); paint(); } light(hi < 0 ? (e.key === 'ArrowDown' ? 0 : -1) : hi + (e.key === 'ArrowDown' ? 1 : -1)); }
    if (e.key === 'Enter' && hi >= 0 && !dd.classList.contains('shut')){ const b = $$('.six-it:not([data-ghost])', res)[hi]; if (b && b.onmousedown){ e.preventDefault(); b.onmousedown(e); } }
    if (e.key === 'Escape'){ e.preventDefault(); if (!dd.classList.contains('shut')){ dd.classList.add('shut'); inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); } else if (inp.value || scope){ inp.value = ''; scope = null; chips.innerHTML = ''; paint(); } } };
  xB.onmousedown = e => { e.preventDefault(); inp.value = ''; scope = null; chips.innerHTML = ''; paint(); };
  c.on(document, 'pointerdown', e => { if (!r.contains(e.target) && document.activeElement !== inp) shut(); });
  // the preview types a question on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  c.auto(900, () => c.run(async () => { box.classList.add('f'); c.taken(() => { if (document.activeElement !== inp) shut(); }); dd.classList.remove('shut'); paint(); await c.step(600); await c.type(inp, 'why did pricing change?', { ms:45, each:paint }); }));
});
/* ---------- Country select ---------- */
DM.def('country-select', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  const C = [
    ['United States','US',['#b22234','#fff','#3c3b6e'],1,'USD'],['United Kingdom','GB',['#012169','#fff','#c8102e'],0,'GBP'],['Germany','DE',['#000','#dd0000','#ffce00'],1,'EUR'],['France','FR',['#0055a4','#fff','#ef4135'],0,'EUR'],
    ['Netherlands','NL',['#ae1c28','#fff','#21468b'],1,'EUR'],['Ireland','IE',['#169b62','#fff','#ff883e'],0,'EUR'],['Italy','IT',['#009246','#fff','#ce2b37'],0,'EUR'],['Japan','JP',['#fff','#bc002d','#fff'],0,'JPY'],
    ['Canada','CA',['#d80621','#fff','#d80621'],0,'CAD'],['Spain','ES',['#aa151b','#f1bf00','#aa151b'],1,'EUR'],['Sweden','SE',['#006aa7','#fecc00','#006aa7'],1,'SEK'],['Australia','AU',['#012169','#fff','#e4002b'],0,'AUD']
  ];
  const f = $('.csx-f', r), pop = $('.csx-pop', r), q = $('.csx-q', r), list = $('.csx-list', r), h = $('.csx-h', r);
  let sel = C[1], hi = 0, opts = [];
  const flag = co => `<span class="csx-fl">${FLAG(co[1])}</span>`;
  /* the name and the hint crossfade to the country picked and always end on the latest one, so the name never stays on
     an earlier country while the flag (swapped at once) shows the new one */
  const put = (el, t) => { el._to = t; if (el._t || el.textContent === t) return; el.classList.add('sw', 'out');
    el._t = setTimeout(() => { el._t = 0; el.textContent = el._to; el.classList.remove('out'); }, REDUCE ? 0 : 170); };
  function setSel(co){ sel = co; $('.csx-fl', f).outerHTML = flag(co); put($('.csx-v', f), co[0]); put(h, 'Prices shown in ' + co[4]); }
  function paint(){
    const v = q.value.trim().toLowerCase(); const m = C.filter(co => !v || co[0].toLowerCase().includes(v) || co[1].toLowerCase() === v);
    list.innerHTML = (v ? '' : '<div class="csx-g">Suggested</div>') + m.map(co => `<button class="csx-o" role="option" id="${list.id}-${co[1]}" tabindex="-1" aria-selected="${co === sel}" data-c="${co[1]}">${flag(co)}${co[0]}<span class="cd">${co[4]}</span><span class="ck">${I('check','xs')}</span></button>`).join('') || '<div class="csx-g">No country found</div>';
    opts = $$('.csx-o', list); hi = Math.max(0, opts.findIndex(o => o.dataset.c === sel[1])); move(0);
    opts.forEach((o, i) => { o.onmouseenter = () => { hi = i; move(0); }; o.onclick = () => { setSel(C.find(x => x[1] === o.dataset.c)); close(); }; });
  }
  function move(d){ if (!opts.length){ q.removeAttribute('aria-activedescendant'); return; } hi = (hi + d + opts.length) % opts.length; opts.forEach((o, i) => o.classList.toggle('hl', i === hi)); opts[hi].scrollIntoView({ block:'nearest' }); q.setAttribute('aria-activedescendant', opts[hi].id); }
  list.id = 'csx-l-' + Math.random().toString(36).slice(2, 7); q.setAttribute('role', 'combobox'); q.setAttribute('aria-autocomplete', 'list'); q.setAttribute('aria-expanded', 'true'); q.setAttribute('aria-controls', list.id);
  // the field sits centred on its own, and glides up once as the list opens; it makes room for the list at its tallest,
  // so it holds still while typing filters the list
  const box = $('.csx', r), full = () => pop.offsetHeight - list.offsetHeight + parseFloat(getComputedStyle(list).maxHeight);
  const centred = centre(c, box, () => pop.classList.contains('open') ? Math.max(box.offsetHeight, pop.offsetTop + full()) : box.offsetHeight);
  function open(demo){ pop.classList.add('open'); f.setAttribute('aria-expanded', 'true'); q.value = ''; paint(); centred(); if (!demo) q.focus({ preventScroll:true }); }
  // on closing, the field waits for the list to fade before it glides back to the middle
  function close(){ pop.classList.remove('open'); f.setAttribute('aria-expanded', 'false'); c.later(REDUCE ? 0 : 180, centred); }
  f.onclick = () => pop.classList.contains('open') ? close() : open();
  q.oninput = paint;
  // in the search box the arrows move through the countries and wrap, Enter picks, and Escape closes the list and gives the
  // focus back to the field (Home and End stay with the text)
  q.onkeydown = e => { if (e.key === 'ArrowDown'){ move(1); e.preventDefault(); } else if (e.key === 'ArrowUp'){ move(-1); e.preventDefault(); } else if (e.key === 'Enter'){ e.preventDefault(); if (opts[hi]){ opts[hi].click(); f.focus({ preventScroll:true }); } } else if (e.key === 'Escape'){ e.preventDefault(); close(); f.focus({ preventScroll:true }); } };
  // Tab out of the list closes it
  c.on(pop, 'focusout', e => { if (pop.classList.contains('open') && e.relatedTarget && !pop.contains(e.relatedTarget) && e.relatedTarget !== f) close(); });
  // the field opens the list with the down and up arrows too, or takes the focus into it when it is already open
  c.on(f, 'keydown', e => { if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return; e.preventDefault(); if (pop.classList.contains('open')) q.focus({ preventScroll:true }); else open(); });
  c.on(document, 'pointerdown', e => { if (!r.contains(e.target)) close(); });
  $('.csx-v', f).textContent = sel[0]; f.insertAdjacentHTML('afterbegin', ''); $('.csx-fl', f).outerHTML = flag(sel);
  // the preview's story: open the list, type "ger", and pick Germany, which closes it on the new country. It stops at the
  // visitor's first click or key in the component, so it never types into their search or picks over their choice
  c.later(900, () => c.run(async () => { const on = () => { if (c.mine) throw 'stop'; };
    on(); open(true); await c.wait(500); for (const ch of 'ger'){ on(); q.value += ch; paint(); await c.wait(160); } await c.wait(1100); on(); if (opts[hi]) opts[hi].click(); }));
});
/* ---------- Multi-select ---------- */
DM.def('multi-select', (r, c) => {
  const uid = Math.random().toString(36).slice(2, 7);
  // tags for the pricing page, and how many files carry each
  const T = [['Accessibility', 14], ['Billing', 9], ['Copy', 22], ['Design system', 31], ['Launch', 12], ['Mobile', 18], ['Onboarding', 7], ['Pricing', 16], ['Research', 11], ['Tokens', 25], ['Tooltips', 6]];
  const f = $('.msc-f', r), q = $('.msc-q', r), pop = $('.msc-pop', r), list = $('.msc-list', r), key = $('.msc-key', r), label = $('.msc-l', r);
  q.id = 'msc-q-' + uid; label.htmlFor = q.id; list.id = 'msc-l-' + uid; q.setAttribute('aria-controls', list.id);
  let picked = ['Launch'], hi = 0, opts = [];
  const clr = $('.msc-clr', r);
  // the chips sit in the box before the input, each with its own remove button
  function chips(){
    $$('.msc-c', f).forEach(ch => ch.remove());
    picked.forEach(t => { const ch = html(`<span class="msc-c" data-t="${t}">${t}<button aria-label="Remove ${t}">${I('x','xs')}</button></span>`); $('button', ch).onclick = e => { e.stopPropagation(); remove(t); }; f.insertBefore(ch, q); });
    clr.hidden = !picked.length;
    place();
  }
  const place = () => { pop.style.top = (f.offsetTop + f.offsetHeight + 6) + 'px'; };
  function paint(){
    const v = q.value.trim().toLowerCase(), m = T.filter(([t]) => !v || t.toLowerCase().includes(v));
    list.innerHTML = m.length ? m.map(([t, n], i) => `<div class="msc-o" role="option" id="msc-o-${i}-${uid}" aria-selected="${picked.includes(t)}" data-t="${t}"><span class="bx">${I('check','xs')}</span>${t}<span class="n num">${n}</span></div>`).join('') : '<div class="msc-none">No tags match</div>';
    opts = $$('.msc-o', list); hi = Math.min(hi, Math.max(0, opts.length - 1)); move(0);
    opts.forEach((o, i) => { o.onmousemove = () => { if (hi !== i){ hi = i; move(0); } }; o.onmousedown = e => e.preventDefault(); o.onclick = () => toggle(o.dataset.t); });
  }
  function move(d){
    if (!opts.length){ q.removeAttribute('aria-activedescendant'); return; }
    hi = (hi + d + opts.length) % opts.length; opts.forEach((o, i) => o.classList.toggle('hl', i === hi));
    q.setAttribute('aria-activedescendant', opts[hi].id);
    const o = opts[hi], top = o.offsetTop, bot = top + o.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top; else if (bot > list.scrollTop + list.clientHeight) list.scrollTop = bot - list.clientHeight;
  }
  const isOpen = () => pop.classList.contains('open');
  // the box sits centred on its own, and glides up once as the list opens; it makes room for the list at its tallest, so it
  // holds still while typing filters the list. The list's place comes from the box, not its top mid-move, so chips
  // wrapping onto a new line move both together
  const box = $('.msc', r), full = () => pop.offsetHeight - list.offsetHeight + parseFloat(getComputedStyle(list).maxHeight);
  const centred = centre(c, box, () => isOpen() ? Math.max(box.offsetHeight, f.offsetTop + f.offsetHeight + 6 + full()) : box.offsetHeight);
  function open(){ if (isOpen()) return; place(); pop.classList.add('open'); q.setAttribute('aria-expanded', 'true'); hi = 0; paint(); centred(); }
  // on closing, the box waits for the list to fade before it glides back to the middle
  function close(){ pop.classList.remove('open'); q.setAttribute('aria-expanded', 'false'); q.removeAttribute('aria-activedescendant'); c.later(REDUCE ? 0 : 180, centred); }
  // Enter or a click picks a tag, or unpicks one already picked; the box clears for the next one
  function toggle(t){ picked = picked.includes(t) ? picked.filter(x => x !== t) : [...picked, t]; q.value = ''; chips(); paint(); hi = Math.max(0, opts.findIndex(o => o.dataset.t === t)); move(0); }
  function remove(t){ const ch = $(`.msc-c[data-t="${t}"]`, f); picked = picked.filter(x => x !== t); if (ch && !REDUCE){ ch.classList.add('go'); c.later(220, () => { chips(); if (isOpen()) paint(); }); } else { chips(); if (isOpen()) paint(); } }
  // a click on the box opens the list; only a real click takes the focus, so the preview never moves the page
  f.onclick = e => { if (e.target.closest('.msc-c')) return; if (e.isTrusted) q.focus({ preventScroll:true }); open(); };
  q.oninput = () => { open(); hi = 0; paint(); };
  q.onkeydown = e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); if (!isOpen()) return open(); move(e.key === 'ArrowDown' ? 1 : -1); }
    else if (e.key === 'Enter'){ e.preventDefault(); if (isOpen() && opts[hi]) toggle(opts[hi].dataset.t); else open(); }
    else if (e.key === 'Escape'){ if (isOpen()){ e.preventDefault(); close(); } }
    else if (e.key === 'Backspace' && !q.value && picked.length) remove(picked[picked.length - 1]);
    else if (e.key === 'Tab') close();
  };
  c.on(document, 'pointerdown', e => { if (!r.contains(e.target)) close(); });
  // Clear all takes every chip off at once; the cursor goes back to the box, so the next tag can be typed straight away
  clr.onmousedown = e => e.preventDefault();
  clr.onclick = e => { picked = []; chips(); if (isOpen()) paint(); if (e.isTrusted) q.focus({ preventScroll:true }); };
  chips();
  // the preview's story types and presses keys in the box without taking the focus, and shows each key as it goes
  const press = async (s, k, label) => { key.textContent = label || k; key.classList.add('on'); q.dispatchEvent(new KeyboardEvent('keydown', { key:k, bubbles:true })); await s.beat(2); key.classList.remove('on'); };
  const type = (s, text) => s.type(q, text, { n:.4, each:() => q.oninput(), keep:true });
  // the preview's story: add Pricing, pick Tooltips by mistake and take it off with Backspace, then add Tokens
  c.story(async s => {
    await s.beat(3);
    await s.tap(f); open(); s.away(); await s.beat(2);
    await type(s, 'pri'); await s.beat(1);
    await press(s, 'Enter');
    await type(s, 'to'); await s.beat(1);
    await press(s, 'ArrowDown', '↓');
    await press(s, 'Enter'); await s.beat(1);
    await press(s, 'Backspace');
    await type(s, 'tok'); await s.beat(1);
    await press(s, 'Enter');
    await press(s, 'Escape', 'Esc'); await s.beat(2);
  });
});
/* ---------- Social sign-in ---------- */
DM.def('social-signin', (r, c) => {
  const P = [['Google','google'],['GitHub','github'],['Figma','figma'],['SSO','']];
  let last = 'Figma';
  const list = $('.ssi-list', r), root = $('.ssi', r);
  const mark = p => p[1] ? BRAND[p[1]] : I('lock','s');
  function paint(){
    list.innerHTML = P.map(p => `<button class="ssi-b${p[0] === last ? ' last-used' : ''}" data-p="${p[0]}"><span class="mk">${mark(p)}</span><span class="lb">Continue with ${p[0]}</span>${p[0] === last ? '<span class="last">Last used</span>' : ''}</button>`).join('') + '';
    stagger($$('.ssi-b', list), 50);
    $$('.ssi-b', list).forEach(b => b.onclick = () => c.run(async () => {
      b.classList.add('busy'); list.classList.add('wait'); $('.mk', b).innerHTML = '<span class="spin"></span>';
      await c.wait(1100); last = b.dataset.p;
      hold(root); const kids = [...root.children]; kids.forEach(k => k.hidden = true);
      const ok = html(`<div class="ssi-ok">${AV('MK','var(--av-l)')}<b>Welcome back, Maya</b><span class="muted">Signed in with ${last}</span><button class="pill ghost sm">Sign out</button></div>`);
      root.appendChild(ok); stagger([...ok.children], 60);
      $('button', ok).onclick = () => { ok.remove(); release(root); kids.forEach(k => k.hidden = false); list.classList.remove('wait'); paint(); };
    }));
  }
  paint();
});
/* ---------- Sign in ---------- */
DM.def('sign-in', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{l}', I('chev-l','xs')).replace('{mail}', I('mail','xs'));
  const card = $('.sgx', r), ntf = $('.sgx-ntf', r), cp = $('.sgx-cp', r), s1 = $('.sgx-1', r), s2 = $('.sgx-2', r), em = $('.sgx-em', r), err = $('.sgx-err', r), go = $('.sgx-go', r), code = $('.sgx-code', r);
  code.innerHTML = Array.from({ length:6 }, (_, i) => `<input inputmode="numeric" maxlength="1" autocomplete="${i ? 'off' : 'one-time-code'}" aria-label="Digit ${i + 1}" style="--i:${i}">`).join('');
  const CODE = '482157';
  const ins = $$('input', code);
  const send = demo => c.run(async () => {
    const v = em.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(v)){ const f = em.parentElement; f.classList.remove('bad'); void f.offsetWidth; f.classList.add('bad'); swap(err, v ? 'That email looks incomplete' : 'Enter your email'); return; }
    em.parentElement.classList.remove('bad'); swap(err, ''); go.innerHTML = '<span class="spin"></span>'; await c.wait(800);
    s1.hidden = true; s2.hidden = false; s2.classList.remove('in'); void s2.offsetWidth; s2.classList.add('in'); $('.sgx-to', r).textContent = v; if (demo !== true && c.mine) ins[0].focus({ preventScroll:true }); c.later(900, () => ntf.classList.remove('shut'));
    let n = 30; const ns = $('.sgx-rs .num', r); const iv = c.every(1000, () => { if (checking || !ns.isConnected) return clearInterval(iv); n--; ns.textContent = n; if (n <= 0){ clearInterval(iv); $('.sgx-rs', r).innerHTML = '<button style="color:var(--accent-fg,var(--accent));font-weight:500">Resend code</button>'; } });
  });
  go.onclick = () => send(); em.onkeydown = e => { if (e.key === 'Enter') send(); };
  $('.sgx-bk', r).onclick = () => { s2.hidden = true; s1.hidden = false; s1.classList.remove('in'); void s1.offsetWidth; s1.classList.add('in'); go.textContent = 'Send code'; ins.forEach(i => i.value = ''); };
  let checking = false;
  /* verifying, then each digit turns green in turn, then the confirmed screen */
  function check(){ if (checking || !ins.every(i => i.value)) return; checking = true; c.run(async () => {
    const rs = $('.sgx-rs', r); ins.forEach(i => { i.blur(); i.readOnly = true; });
    code.classList.add('vf'); rs.innerHTML = '<span class="sgx-v"><span class="spin"></span>Verifying code</span>'; await c.wait(1100);
    code.classList.remove('vf'); code.classList.add('ok'); rs.innerHTML = `<span class="sgx-v ok">${I('check','xs')}Code confirmed</span>`; enter(rs.firstChild); await c.wait(1100);
    hold(card); [...card.children].forEach(k => k.hidden = true);
    const d = html(`<div class="sgx-done"><svg class="sgx-ck" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="m16 27 7 7 13-14"/></svg><b>You're in</b><span class="muted">Opening your workspace</span><span class="sgx-bar"><i></i></span></div>`);
    card.appendChild(d); stagger([...d.children].slice(1), 90, 250); }); }
  // a pasted code fills every box from the first; any 6 digits go through in the demo
  const paste = t => { t = t.replace(/\D/g, '').slice(0, 6); if (!t || checking) return; t.split('').forEach((d, j) => { if (ins[j]) ins[j].value = d; }); if (c.mine) ins[Math.min(5, t.length)].focus({ preventScroll:true }); check(); };
  // Copy puts the code on the clipboard, the way a phone offers it from the email; then it is pasted into the boxes
  cp.onclick = () => { try { navigator.clipboard.writeText(CODE).catch(() => {}); } catch(e){} swap(cp, 'Copied'); cp.disabled = true; swap($('.sgx-hint', r), 'Paste it into the first box'); const at = ins.find(i => !i.value); if (at && c.mine) at.focus({ preventScroll:true }); };
  ins.forEach((i, k) => {
    i.oninput = () => { i.value = i.value.replace(/\D/g, '').slice(-1); if (i.value && ins[k + 1]) ins[k + 1].focus({ preventScroll:true }); check(); };
    i.onkeydown = e => { if (e.key === 'Backspace' && !i.value && ins[k - 1]){ ins[k - 1].focus({ preventScroll:true }); ins[k - 1].value = ''; } };
    i.onpaste = e => { const t = (e.clipboardData.getData('text') || '').replace(/\D/g, ''); if (!t) return; e.preventDefault(); paste(t); };
  });
  // the preview's story: type an email and send it, the email arrives, copy its code and paste it in. The visitor can take
  // over at any point and go through it with their own email and any 6 digits
  c.story(async s => {
    await s.beat(2); await s.tap(em); await s.type(em, 'maya@studio.com', { n:.08 });
    await s.beat(1); await s.tap(go); s.away();
    await s.until(() => !ntf.classList.contains('shut')); await s.beat(3);
    await s.tap(cp); s.away(); await s.beat(2);
    paste(CODE); await s.until(() => !!$('.sgx-done', r)); await s.beat(4);
  });
});
/* ---------- OTP field ---------- */
DM.def('otp-field', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{mail}', I('mail'));
  const CODE = '482157';
  const box = $('.otp-in', r), msg = $('.otp-m', r), rs = $('.otp-rs', r);
  // one box per digit, with a short dash between the two halves. The first box carries autocomplete="one-time-code",
  // so a phone can offer the code from a message
  box.innerHTML = Array.from({ length:6 }, (_, i) => `${i === 3 ? '<span class="sep" aria-hidden="true"></span>' : ''}<input class="otp-d" inputmode="numeric" pattern="[0-9]*" maxlength="1" autocomplete="${i ? 'off' : 'one-time-code'}" aria-label="Digit ${i + 1} of 6">`).join('');
  const ins = $$('.otp-d', box);
  let state = 'idle', tries = 3;
  const say = (h, cls) => { msg.className = 'otp-m' + (cls ? ' ' + cls : ''); msg.innerHTML = h; if (h) enter(msg); };
  const code = () => ins.map(i => i.value).join('');
  const pop = el => { el.classList.add('bump'); c.later(160, () => el.classList.remove('bump')); };
  // a wrong code stays red until you type again, which starts it over
  function fresh(){ if (state !== 'bad') return; state = 'idle'; box.classList.remove('bad'); ins.forEach(i => { i.value = ''; i.removeAttribute('aria-invalid'); }); say(''); }
  function put(i, d){ fresh(); ins[i].value = d; pop(ins[i]); if (code().length === 6) verify(); }
  // the code is checked as soon as the last box is filled
  function verify(){
    if (state !== 'idle') return; state = 'vf';
    c.run(async () => {
      box.classList.add('vf'); ins.forEach(i => { i.readOnly = true; i.blur(); }); say('<span class="spin"></span>Checking the code');
      await c.wait(900); box.classList.remove('vf'); ins.forEach(i => i.readOnly = false);
      if (code() === CODE){
        state = 'ok'; box.classList.add('ok'); ins.forEach(i => i.readOnly = true);
        say(`${I('ok','xs')}Email verified`, 'ok'); rs.parentElement.hidden = true; return;
      }
      state = 'bad'; tries--; box.classList.remove('bad'); void box.offsetWidth; box.classList.add('bad'); ins.forEach(i => i.setAttribute('aria-invalid', 'true'));
      say(`${I('alert','xs')}That code doesn't match. ${tries ? `${tries} ${tries === 1 ? 'try' : 'tries'} left` : 'Send a new code to try again'}`, 'bad');
    });
  }
  // typing a digit fills the box and moves on; Backspace clears it, or the one before; the arrows move; a paste fills
  // every box from the first
  ins.forEach((inp, i) => {
    inp.oninput = () => { const d = inp.value.replace(/\D/g, ''); inp.value = ''; if (!d) return; if (d.length > 1) return fill(d); put(i, d); if (ins[i + 1] && state === 'idle') ins[i + 1].focus(); };
    inp.onkeydown = e => {
      if (e.key === 'Backspace'){ e.preventDefault(); if (state === 'bad'){ fresh(); ins[0].focus(); } else if (inp.value){ inp.value = ''; } else if (ins[i - 1]){ ins[i - 1].value = ''; ins[i - 1].focus(); } }
      else if (e.key === 'ArrowLeft' && ins[i - 1]){ e.preventDefault(); ins[i - 1].focus(); }
      else if (e.key === 'ArrowRight' && ins[i + 1]){ e.preventDefault(); ins[i + 1].focus(); }
      else if (/^\d$/.test(e.key) && inp.value){ e.preventDefault(); const j = state === 'bad' ? 0 : i; put(j, e.key); if (ins[j + 1] && state === 'idle') ins[j + 1].focus(); }
    };
    inp.onpaste = e => { e.preventDefault(); fill((e.clipboardData || window.clipboardData).getData('text')); };
    inp.onfocus = () => inp.select();
  });
  function fill(text, focus = true){
    const d = text.replace(/\D/g, '').slice(0, 6); if (!d) return;
    fresh(); ins.forEach((inp, i) => { inp.value = d[i] || ''; if (d[i]) c.later(i * 40, () => pop(inp)); });
    if (d.length === 6) verify(); else if (focus) ins[d.length].focus();
  }
  // the resend link waits thirty seconds
  let left = 30; const ns = $('.num', rs);
  const iv = c.every(1000, () => { if (state === 'ok') return clearInterval(iv); left--; ns.textContent = '0:' + String(left).padStart(2, '0'); if (left <= 0){ clearInterval(iv); rs.innerHTML = '<button>Resend code</button>'; $('button', rs).onclick = () => { rs.textContent = 'A new code is on its way'; }; } });
  // the preview's story: paste a code with two digits swapped, see it fail, and type the right one
  c.story(async s => {
    await s.beat(3);
    await s.tap(ins[0]); s.away();
    await s.beat(1); fill('482175', false);
    await s.until(() => state === 'bad'); await s.beat(4);
    for (let i = 0; i < 6; i++){ put(i, CODE[i]); await s.beat(1); }
    await s.until(() => state === 'ok'); await s.beat(2);
  });
});
/* ---------- Form ---------- */
DM.def('form', (r, c) => {
  r.innerHTML = r.innerHTML.split('{spark}').join(I('spark','xs'));
  const form = $('.fmx', r), n = $('[name=n]', r), g = $('[name=g]', r), d = $('[name=d]', r), cnt = $('.fmx-c', r), ms = $('.fmx-ms', r);
  let type = null;
  n.oninput = () => { cnt.textContent = n.value.length + '/40'; clear(n); };
  g.oninput = () => clear(g); d.oninput = () => clear(d);
  const chips = $$('.fmx-ty .chip', r);
  chips.forEach(ch => ch.onclick = () => { type = ch.dataset.v; chips.forEach(x => x.classList.toggle('on', x === ch)); clear(ch.parentElement); });
  function clear(el){ const f = el.closest('.fmx-f'); f.classList.remove('bad', 'ai'); $('.er', f)?.remove(); }
  function bad(el, t){ const f = el.closest('.fmx-f'); if (f.classList.contains('bad')) return; f.classList.add('bad'); f.insertAdjacentHTML('beforeend', `<span class="er">${t}</span>`); }
  async function type_(el, s){ el.closest('.fmx-f').classList.add('ai'); el.value = ''; for (const ch of s){ el.value += ch; el.dispatchEvent(new Event('input')); el.closest('.fmx-f').classList.add('ai'); await c.wait(18); } }
  $('.fmx-ai', r).onclick = () => c.run(async () => {
    const b = $('.fmx-ai', r); b.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span>Drafting';
    if (!n.value) await type_(n, 'Pricing refresh');
    await type_(g, 'Lift trial to paid by showing annual plans first and keeping one CTA per card.');
    if (!type) chips[0].click();
    if (!d.value) await type_(d, 'Nov 14');
    b.innerHTML = I('check','xs') + 'Drafted'; swap(ms, 'Review what the agent drafted');
  });
  // the preview has the agent fill it in once on its own, unless you take over first
  c.auto(1400, () => { if (!n.value) $('.fmx-ai', r).click(); });
  form.onsubmit = e => { e.preventDefault(); let ok = true;
    if (!n.value.trim()){ bad(n, 'Give it a name'); ok = false; }
    if (g.value.trim().length < 12){ bad(g, 'Add a sentence about the goal'); ok = false; }
    if (!type){ bad(chips[0], 'Pick a type'); ok = false; }
    if (!ok) return swap(ms, 'A few fields need a look');
    c.run(async () => { const go = $('.fmx-go', r); go.innerHTML = '<span class="spin"></span>'; await c.wait(800);
      hold(form); [...form.children].forEach(k => k.hidden = true); const dn = html(`<div class="fmx-done">${I('ok')}<b>${n.value} created</b><span class="muted">The agent is gathering references now</span></div>`); form.appendChild(dn); stagger([...dn.children], 70); }); };
});
/* ---------- Payment form ---------- */
DM.def('payment-form', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{lock}', I('lock','xs'));
  const cn = $('.pyx-cn', r), ex = $('.pyx-ex', r), cv = $('.pyx-cv', r), br = $('.pyx-br', r);
  const BR = [[/^4/, 'VISA', '#1a1f71'], [/^5[1-5]/, 'MC', '#eb001b'], [/^3[47]/, 'AMEX', '#2e77bb']];
  cn.oninput = demo => { const d = cn.value.replace(/\D/g, '').slice(0, 16); cn.value = d.replace(/(.{4})/g, '$1 ').trim(); const b = BR.find(x => x[0].test(d));
    br.classList.toggle('on', !!b); if (b){ br.textContent = b[1]; br.style.background = b[2]; br.style.color = '#fff'; } cn.closest('.pyx-f').classList.remove('bad'); if (d.length === 16 && demo !== true) ex.focus({ preventScroll:true }); };
  ex.oninput = () => { let d = ex.value.replace(/\D/g, '').slice(0, 4); if (d.length === 1 && +d > 1) d = '0' + d; ex.value = d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; ex.closest('.pyx-f').classList.remove('bad'); if (d.length === 4) cv.focus({ preventScroll:true }); };
  cv.oninput = () => { cv.value = cv.value.replace(/\D/g, ''); cv.closest('.pyx-f').classList.remove('bad'); };
  let per = 'y', tot = 691.2;
  function price(){ const unit = 24, sub = unit * 3, yr = per === 'y'; const t = yr ? sub * 12 * .8 : sub;
    $('.pyx-s', r).textContent = '$' + (yr ? sub * 12 : sub).toFixed(2); $('.pyx-d', r).textContent = yr ? '−$' + (sub * 12 * .2).toFixed(2) : '−$0.00'; $('.pyx-dc', r).classList.toggle('off', !yr);
    $('.pyx-u', r).textContent = yr ? '$24 × 12' : '$24';
    tween(tot, t, 600, v => { tot = v; $('.pyx-tot', r).textContent = '$' + v.toFixed(2); $('.pyx-gt', r).textContent = '$' + v.toFixed(2); }); }
  seg($('.pyx-per', r), v => { per = v; price(); });
  price();
  $('.pyx', r).onsubmit = e => { e.preventDefault(); let ok = true;
    [[cn, cn.value.replace(/\D/g, '').length === 16], [ex, /^\d\d \/ \d\d$/.test(ex.value)], [cv, cv.value.length >= 3]].forEach(([el, good]) => { if (!good){ ok = false; const f = el.closest('.pyx-f'); f.classList.remove('bad'); void f.offsetWidth; f.classList.add('bad'); } });
    if (!ok) return;
    c.run(async () => { const go = $('.pyx-go', r); go.innerHTML = '<span class="spin" style="border-color:rgba(255,255,255,.3);border-top-color:#fff"></span>Processing'; await c.wait(1200); go.classList.add('ok'); go.innerHTML = I('check','xs') + 'Payment successful'; enter(go.firstChild); }); };
  // the preview types a test card on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  c.auto(1000, () => c.run(() => c.type(cn, '4242424242424242', { ms:45, each:() => cn.oninput(true) })));
});
/* ---------- Colour picker ---------- */
DM.def('color-picker', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{wand}', I('wand','xs')).replace('{layers}', I('layers','xs'));
  const root = $('.cpk', r), sv = $('.cpk-sv', r), hue = $('.cpk-hue', r), al = $('.cpk-al', r), [kSv, kH, kA] = $$('.cpk-k', r);
  const hx = $('.cpk-hx input', r), hxL = $('.cpk-hx', r), aOut = $('.cpk-a', r), sw = $('.cpk-sw', r), lines = $$('.cpk-ln', r), fix = $('.cpk-fix', r), mk = $('.cpk-mk', r), sc = $('.cpk-sc', r), sr = $('.cpk-sr', r);
  const INK = '#111111';
  // colour maths: HSV for picking, hex for reading, relative luminance for contrast (WCAG 2)
  const hsv2rgb = (h, s, v) => { const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5), f(3), f(1)].map(x => Math.round(x * 255)); };
  const rgb2hsv = ([r1, g1, b1]) => { const [R, G, B] = [r1, g1, b1].map(x => x / 255), mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn; let h = 0;
    if (d) h = mx === R ? ((G - B) / d) % 6 : mx === G ? (B - R) / d + 2 : (R - G) / d + 4; return [(h * 60 + 360) % 360, mx ? d / mx : 0, mx]; };
  const hex = rgb => '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
  const parse = t => { const m = t.trim().replace(/^#/, '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i); if (!m) return null; let s = m[1]; if (s.length === 3) s = [...s].map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16)); };
  const lum = rgb => { const [R, G, B] = rgb.map(x => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }); return .2126 * R + .7152 * G + .0722 * B; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  let H = 172, S = .62, V = .62, A = 1;
  const SW = ['#2f8cff', '#7c4dff', '#ff4d6d', '#ff9f1c', '#22c993', '#00a2bf', '#1f2937', '#f5c400'];
  sw.innerHTML = SW.map(x => `<button style="--s:${x}" aria-label="${x}" data-tip="${x.toUpperCase()}" aria-pressed="false" data-v="${x}"></button>`).join('');
  const rgb = () => hsv2rgb(H, S, V);
  function paint(from){
    const c1 = rgb(), hc = hex(c1);
    root.style.setProperty('--hc', `hsl(${H} 100% 50%)`); root.style.setProperty('--c', A < 1 ? `rgb(${c1.join(' ')} / ${A})` : hc);
    kSv.style.left = S * 100 + '%'; kSv.style.top = (1 - V) * 100 + '%'; kSv.style.background = hc;
    kH.style.left = H / 359 * 100 + '%'; kH.style.background = `hsl(${H} 100% 50%)`;
    kA.style.left = A * 100 + '%'; kA.style.background = hc;
    kSv.setAttribute('aria-valuenow', Math.round(S * 100)); kSv.setAttribute('aria-valuetext', `Saturation ${Math.round(S * 100)}%, brightness ${Math.round(V * 100)}%`);
    kH.setAttribute('aria-valuenow', Math.round(H)); kH.setAttribute('aria-valuetext', Math.round(H) + ' degrees');
    kA.setAttribute('aria-valuenow', Math.round(A * 100)); kA.setAttribute('aria-valuetext', Math.round(A * 100) + '% opaque');
    if (from !== 'hex' && document.activeElement !== hx){ hx.value = hc.slice(1).toUpperCase(); hxL.removeAttribute('aria-invalid'); }
    aOut.textContent = Math.round(A * 100) + '%';
    $$('button', sw).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === hc));
    // contrast with white and with ink text, as a ratio and in words (4.5:1 for body text)
    lines.forEach(l => { const on = l.dataset.on === 'ink' ? INK : '#ffffff', x = ratio(c1, parse(on)), ok = x >= 4.5;
      $('.cpk-aa', l).style.color = on; $('.r', l).textContent = x.toFixed(1) + ':1'; const t = $('.tag', l); t.className = 'tag ' + (ok ? 'ok' : 'bad'); t.textContent = ok ? 'Pass' : 'Fail'; });
    const passW = ratio(c1, [255, 255, 255]) >= 4.5; fix.disabled = passW; fix.innerHTML = `${I('wand','xs')}${passW ? 'White text passes' : 'Suggest an accessible shade'}`;
  }
  // dragging: the field sets saturation and brightness, the rails hue and opacity
  const drag = (el, set) => { c.on(el, 'pointerdown', e => { if (e.button) return; e.preventDefault(); el.setPointerCapture(e.pointerId); const k = $('.cpk-k', el); k.focus({ preventScroll:true }); const mv = ev => { const b = el.getBoundingClientRect(); set(Math.max(0, Math.min(1, (ev.clientX - b.left) / b.width)), Math.max(0, Math.min(1, (ev.clientY - b.top) / b.height))); paint(); }; mv(e); el.onpointermove = mv; }); c.on(el, 'pointerup', () => el.onpointermove = null); };
  drag(sv, (x, y) => { S = x; V = 1 - y; }); drag(hue, x => { H = x * 359; }); drag(al, x => { A = x; });
  // the keys: arrows move one step, Shift ten, Home and End to the ends
  const keys = (k, fn) => c.on(k, 'keydown', e => { const n = e.shiftKey ? 10 : 1, m = { ArrowLeft:[-n, 0], ArrowRight:[n, 0], ArrowUp:[0, n], ArrowDown:[0, -n], Home:['min', 0], End:['max', 0] }[e.key]; if (!m) return; e.preventDefault(); fn(m); paint(); });
  const cl = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  keys(kSv, ([dx, dy]) => { if (dx === 'min') S = 0; else if (dx === 'max') S = 1; else { S = cl(S + dx / 100, 0, 1); V = cl(V + dy / 100, 0, 1); } });
  keys(kH, ([dx, dy]) => { H = dx === 'min' ? 0 : dx === 'max' ? 359 : cl(H + (dx || dy), 0, 359); });
  keys(kA, ([dx, dy]) => { A = dx === 'min' ? 0 : dx === 'max' ? 1 : cl(A + (dx || dy) / 100, 0, 1); });
  // the hex field: Enter keeps a valid colour, Escape puts back the one before, a wrong one is marked
  let before = '';
  const commit = () => { const p = parse(hx.value); if (p){ [H, S, V] = rgb2hsv(p); hxL.removeAttribute('aria-invalid'); paint(); } else { hxL.setAttribute('aria-invalid', 'true'); } };
  c.on(hx, 'focus', () => { before = hx.value; hx.select(); });
  c.on(hx, 'input', () => { hx.value = hx.value.replace(/[^0-9a-f#]/gi, ''); hxL.removeAttribute('aria-invalid'); });
  c.on(hx, 'keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); commit(); } if (e.key === 'Escape'){ hx.value = before; hxL.removeAttribute('aria-invalid'); } });
  c.on(hx, 'blur', () => { if (parse(hx.value)) commit(); else { hx.value = before; hxL.removeAttribute('aria-invalid'); } });
  // a swatch glides there
  const glide = (to, ms = 500) => { const [h1, s1, v1] = rgb2hsv(to), h0 = H, s0 = S, v0 = V, dh = ((h1 - h0 + 540) % 360) - 180; return tween(0, 1, ms, t => { H = (h0 + dh * t + 360) % 360; S = s0 + (s1 - s0) * t; V = v0 + (v1 - v0) * t; paint(); }); };
  $$('button', sw).forEach(b => b.onclick = () => glide(parse(b.dataset.v)));
  // the agent: the nearest shade (the same hue and saturation, darker) where white text passes, then a 50 to 900 scale
  fix.onclick = () => c.run(async () => {
    let v = V; while (v > 0 && ratio(hsv2rgb(H, S, v), [255, 255, 255]) < 4.6) v -= .005;
    fix.innerHTML = `<span class="spin"></span>Finding a shade`; await c.wait(500);
    await tween(V, v, 700, x => { V = x; paint(); }); sr.textContent = `Moved to ${hex(rgb()).toUpperCase()}, white text passes`;
  });
  const ramp = () => { const [h, s] = rgb2hsv(rgb()), L = [97, 93, 85, 74, 62, 50, 41, 33, 25, 18];
    return L.map(l => { const sat = Math.min(100, s * 100 * (l > 80 ? .9 : 1)), C = (1 - Math.abs(2 * l / 100 - 1)) * sat / 100, X = C * (1 - Math.abs((h / 60) % 2 - 1)), m = l / 100 - C / 2;
      const [r1, g1, b1] = h < 60 ? [C, X, 0] : h < 120 ? [X, C, 0] : h < 180 ? [0, C, X] : h < 240 ? [0, X, C] : h < 300 ? [X, 0, C] : [C, 0, X];
      return hex([r1, g1, b1].map(x => Math.round((x + m) * 255))); }); };
  mk.onclick = () => c.run(async () => {
    const R2 = ramp(), names = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900], here = hex(rgb());
    // the step nearest the picked colour is its place in the scale
    const near = R2.reduce((b, x, i) => Math.abs(lum(parse(x)) - lum(parse(here))) < Math.abs(lum(parse(R2[b])) - lum(parse(here))) ? i : b, 0);
    sc.innerHTML = ''; mk.innerHTML = '<span class="spin"></span>Making a scale'; await c.wait(400);
    for (let i = 0; i < 10; i++){ const b = html(`<button data-tip="${names[i]}: ${(i === near ? here : R2[i]).toUpperCase()}" aria-label="${names[i]}, ${(i === near ? here : R2[i]).toUpperCase()}"${i === near ? ' class="base"' : ''}><i style="background:${i === near ? here : R2[i]}"></i><span class="num">${names[i]}</span></button>`); sc.appendChild(b); enter(b); await c.wait(60); }
    mk.innerHTML = `${I('layers','xs')}Make a scale`; sr.textContent = `Scale made, ${here.toUpperCase()} is step ${names[near]}`;
  });
  paint();
  // the preview's story: a bright blue fails with white text, the agent darkens it until it passes, then makes a scale from it
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.tap($('button', sw)); await s.beat(3);
    await s.point(lines[0], false); await s.beat(2);
    await s.tap(fix); await s.beat(4);
    await s.tap(mk); s.away(); await s.beat(6);
  });
});
/* ---------- Progress and meter ---------- */
DM.def('progress', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{pause}', I('pause'));
  const root = $('.prg', r), ring = $('.prg-ring', r), arc = $('.prg-ring .fl', r), pc = $('.prg-pc', r), vt = $('.prg-vt', r), tag = $('.prg-st', r), btn = $('.prg-btn', r);
  const segBox = $('.prg-seg', r), segs = $$('.prg-seg b', r), ll = $('.prg-ll', r), lin = $('.prg-lin', r), bar = $('.prg-lin i', r), sr = $('.prg-sr', r);
  const mb = $('.prg-mb', r), mfl = $('.prg-mb .fl', r), mv = $('.prg-mv', r), mw = $('.prg-mw', r);
  // the run's steps: what each does and what it counts
  const S = [['Reading the sitemap', 'Pages', 48], ['Fetching pages', 'Pages', 48], ['Indexing files', 'Files', 2000], ['Writing embeddings', 'Chunks', 6400], ['Checking links', 'Links', 310]];
  const LIMIT = 10000, fmt = n => Math.round(n).toLocaleString('en-US');
  let state = 'ind', step = 0, sub = 0, secs = 0, credits = 7000, run = 0, failed = false;
  const TAG = { ind:['Starting', ''], run:['Running', 'run'], paused:['Paused', ''], err:['Failed', 'bad'], done:['Done', 'ok'] };
  let shownState = '', shownBand = -1;
  function paint(){
    const all = state === 'done' ? 1 : (step + sub) / S.length, [name, unit, total] = S[Math.min(step, S.length - 1)];
    root.dataset.s = state;
    // the ring: the whole run
    if (state === 'ind'){ ring.removeAttribute('aria-valuenow'); ring.setAttribute('aria-valuetext', 'Preparing the run'); pc.textContent = ''; arc.style.strokeDasharray = ''; }
    else { const p = Math.round(all * 100); ring.setAttribute('aria-valuenow', p); ring.setAttribute('aria-valuemin', 0); ring.setAttribute('aria-valuemax', 100); ring.setAttribute('aria-valuetext', p + '% of the run'); arc.style.strokeDasharray = `${all * 100} 100`;
      if (state === 'done'){ if (!pc.querySelector('.i')){ pc.innerHTML = I('check','xs'); enter(pc.firstElementChild); } } else pc.textContent = p + '%'; }
    // the segments: step n of m
    segs.forEach((b, j) => b.style.setProperty('--f', state === 'done' || j < step ? 1 : j === step && state !== 'ind' ? sub : 0));
    segBox.setAttribute('aria-valuenow', state === 'done' ? S.length : step); segBox.setAttribute('aria-valuetext', state === 'done' ? 'All 5 steps done' : state === 'ind' ? 'Not started' : `Step ${step + 1} of ${S.length}`);
    // the bar: the step in hand
    lin.classList.toggle('ind', state === 'ind');
    const sp = state === 'done' ? 1 : sub;
    bar.style.width = state === 'ind' ? '' : sp * 100 + '%';
    if (state === 'ind'){ lin.removeAttribute('aria-valuenow'); lin.setAttribute('aria-valuetext', 'Working out how much there is'); }
    else { lin.setAttribute('aria-valuenow', Math.round(sp * 100)); lin.setAttribute('aria-valuetext', `${fmt(sp * total)} of ${fmt(total)} ${unit.toLowerCase()}`); }
    // the line over the bar: the count, or what failed and a way on
    if (state === 'err'){ if (shownState !== 'err'){ ll.innerHTML = `<span class="e">${I('alert','xs')}<span>The embeddings service timed out</span></span><button class="pill line sm prg-retry">${I('refresh','xs')}Retry</button>`; enter(ll.firstElementChild); $('.prg-retry', ll).onclick = retry; } }
    else ll.innerHTML = state === 'ind' ? '<span>Getting ready</span><span class="n">Counting pages</span>' : `<span>${unit}</span><span class="n num">${fmt((state === 'done' ? 1 : sub) * total)} of ${fmt(total)}</span>`;
    // the words: Step 3 of 5, indexing files
    const words = { ind:'Preparing the run', run:`Step ${step + 1} of ${S.length}, ${name.toLowerCase()}`, paused:`Paused at step ${step + 1} of ${S.length}`, err:`Failed at step ${step + 1} of ${S.length}`, done:`Indexed 2,000 files in 0:${String(secs).padStart(2, '0')}` }[state];
    if (vt.textContent !== words) vt.textContent = words;
    if (shownState !== state){
      swap(tag, TAG[state][0]); tag.className = 'tag prg-st ' + TAG[state][1];
      const b = state === 'paused' ? ['play', 'Resume'] : state === 'done' ? ['refresh', 'Run again'] : ['pause', 'Pause'];
      btn.innerHTML = I(b[0]); btn.setAttribute('aria-label', b[1]); btn.dataset.tip = b[1]; btn.disabled = state === 'err' || state === 'ind'; btn.style.visibility = state === 'err' ? 'hidden' : '';
      // only a change of state is announced, never every percent
      if (shownState) sr.textContent = { run:'Running', paused:'Paused', err:'Step 4 failed: the embeddings service timed out', done:'Done. ' + words, ind:'Starting' }[state];
      shownState = state;
    }
    // the meter: credits, warning in words from 75% and more strongly from 90%
    const m = credits / LIMIT, band = m >= .9 ? 2 : m >= .75 ? 1 : 0;
    mfl.style.width = Math.min(100, m * 100) + '%'; mv.textContent = fmt(credits);
    mb.classList.toggle('warn', band === 1); mb.classList.toggle('bad', band === 2);
    mb.setAttribute('aria-valuenow', Math.round(credits)); mb.setAttribute('aria-valuetext', `${fmt(credits)} of 10,000 credits` + ['', ', running low', ', almost out'][band]);
    if (band !== shownBand){ mw.innerHTML = ['<span class="muted">On track for the month</span>', `<span class="tag warn">${I('warn','xs')}Running low</span>`, `<span class="tag bad">${I('alert','xs')}Almost out</span>`][band]; if (shownBand >= 0) enter(mw.firstElementChild); shownBand = band; }
  }
  function retry(){ if (state !== 'err') return; state = 'run'; paint(); }
  btn.onclick = () => {
    if (state === 'run'){ state = 'paused'; paint(); }
    else if (state === 'paused'){ state = step || sub ? 'run' : 'ind'; paint(); }
    else if (state === 'done') c.run(go);
  };
  c.every(1000, () => { if (state === 'run') secs++; });
  const until = async f => { while (!f()) await c.wait(100); };
  // the agent's run: it works out what there is, then goes step by step; the fourth step times out once
  async function go(){
    const id = ++run; state = 'ind'; step = 0; sub = 0; secs = 0; credits = 7000; failed = false; paint();
    await c.wait(1800); if (id !== run) return;
    state = 'run';
    for (step = 0; step < S.length; step++){
      sub = 0; paint();
      for (let k = 1; k <= 12; k++){
        await c.wait(150); await until(() => state !== 'paused'); if (id !== run) return;
        if (step === 3 && k === 6 && !failed){ failed = true; state = 'err'; paint(); await until(() => state !== 'err'); if (id !== run) return; await c.wait(400); }
        sub = k / 12; credits += 38; paint();
      }
    }
    step = S.length - 1; state = 'done'; paint();
  }
  paint(); c.run(go);
  // the preview's story: the fourth step fails, the person retries it, and the run finishes
  if (r === c.st) c.story(async s => {
    await s.until(() => state === 'err'); await s.beat(3);
    await s.tap($('.prg-retry', r)); s.away();
    await s.until(() => state === 'done'); await s.beat(4);
  });
});
/* ---------- Progress designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Compact (one calm card, with the steps and the credits as
   layers), Steps (the steps are the progress, the live one raised on a rail) and Budget (the run in front of its queue and
   the month's usage, one meter that says if this run will push the month over). The switch is the card's alone: the
   registry, the code view and the component page install the classic component (build.js leaves a data-designs="card"
   switch out of them) */
{
  const classic = DM.defs['progress'];
  const PRG_D = {};
const PRG_HTML = {
  compact:`<div class="pva panel" data-s="ind">
        <div class="pva-top">
          <div class="pva-id">
            <div class="pva-name" id="pva-n">Indexing the docs</div>
            <div class="pva-st"><span class="pva-mk" aria-hidden="true"><i></i><svg class="i xs e"><use href="#v2i-alert"/></svg><svg class="i xs d"><use href="#v2i-check"/></svg></span><span class="w">Preparing the run</span></div>
          </div>
          <div class="pva-act">
            <button type="button" class="pill sm line pva-retry" hidden><svg class="i xs" aria-hidden="true"><use href="#v2i-refresh"/></svg>Retry</button>
            <button type="button" class="ib pva-btn" aria-label="Pause" data-tip="Pause" disabled><svg class="i" aria-hidden="true"><use href="#v2i-pause"/></svg></button>
          </div>
        </div>
        <div class="fold shut pva-err"><div><p></p></div></div>
        <div class="pva-bar" role="progressbar" aria-labelledby="pva-n" aria-valuemin="0" aria-valuemax="100"><i class="pva-fill"></i></div>
        <div class="pva-meta">
          <span class="pva-eta num">Counting pages</span>
          <button type="button" class="pva-cr" data-pop="#pva-cpop" data-pop-align="end" aria-haspopup="dialog" aria-expanded="false" aria-controls="pva-cpop"><svg class="i s" aria-hidden="true"><use href="#v2i-coins"/></svg><span><span class="v num">0</span> credits<span class="sr"> used by this run</span></span></button>
          <div class="pop pva-pop" id="pva-cpop" role="dialog" aria-label="Credits">
            <div class="pva-ph"><span class="pva-k">This run</span></div>
            <div class="pva-kv pva-c-sr"><span>Spent so far</span><b class="num pva-c-sp">0</b></div>
            <div class="pva-kv"><span class="pva-c-pl">Projected total</span><span class="num x pva-c-pj">534</span></div>
            <div class="pva-kv"><span>Costliest step</span><span class="x">Writing embeddings, <span class="num">342</span></span></div>
            <div class="pva-ps"></div>
            <div class="pva-ph"><span class="pva-k">This month</span><span class="num"><b class="pva-c-mo">7,000</b> of 10,000</span></div>
            <div class="pva-mb" role="meter" aria-label="Credits this month" aria-valuemin="0" aria-valuemax="10000"><i class="a"></i><i class="b"></i><i class="c"></i><i class="th" style="left:75%"></i><i class="th" style="left:90%"></i></div>
            <div class="pva-lg">
              <span><i class="sw a"></i><span class="t">Before this run</span><span class="num pva-c-a">7,000</span></span>
              <span><i class="sw b"></i><span class="t">This run</span><span class="num pva-c-b">0</span></span>
              <span class="pva-c-cl"><i class="sw c"></i><span class="t">Still to come</span><span class="num pva-c-c">534</span></span>
            </div>
            <p class="pva-wn"></p>
          </div>
        </div>
        <div class="pva-sep"></div>
        <button type="button" class="pva-tog" aria-expanded="false" aria-controls="pva-list"><svg class="i s cv" aria-hidden="true"><use href="#v2i-chev-d"/></svg><span class="l">Steps</span><span class="n">0 of 5 done</span><span class="el num">0:00 elapsed</span></button>
        <div class="fold shut pva-fold"><div><ol class="pva-list" id="pva-list" aria-label="Steps"></ol></div></div>
        <p class="sr pva-live" role="status" aria-live="polite"></p>
      </div>`,
  steps:`<div class="pvb panel" data-s="ind">
  <div class="pvb-h">
    <div class="pvb-ht"><b>Indexing the docs</b><span class="pvb-sum num" role="progressbar" aria-label="Run progress" aria-valuemin="0" aria-valuemax="100">Preparing the run</span></div>
    <span class="tag pvb-tag">Starting</span>
    <button type="button" class="ib pvb-btn" aria-label="Pause" data-tip="Pause" disabled><svg class="i" aria-hidden="true"><use href="#v2i-pause"/></svg></button>
  </div>
  <div class="pvb-rw">
    <div class="pvb-lift" aria-hidden="true"></div>
    <ol class="pvb-rail" aria-label="Steps"></ol>
  </div>
  <div class="pvb-f">
    <button type="button" class="pvb-cr" aria-expanded="false">
      <span class="pvb-crl">This run <b class="num pvb-rc">0</b><span class="pvb-x"> credits</span> · Month <b class="num pvb-mc">7,080</b> of 10,000</span>
      <span class="pvb-crw"></span>
      <svg class="i s pvb-cv" aria-hidden="true"><use href="#v2i-chev-d"/></svg>
    </button>
    <div class="pvb-fold pvb-cm"><div><div class="pvb-in">
      <div class="pvb-mb" role="meter" aria-label="Credits this month" aria-valuemin="0" aria-valuemax="10000"><i class="fl"></i><i class="rn"></i><i class="th" style="left:75%"></i><i class="th" style="left:90%"></i></div>
      <div class="pvb-ml num"><span><i class="e"></i>Earlier this month <b class="pvb-me">7,080</b></span><span><i></i>This run <b class="pvb-mr">0</b></span></div>
      <p class="pvb-mn num">Warns at 7,500 and 9,000 · Resets Dec 1</p>
    </div></div></div>
  </div>
  <p class="pvb-sr" aria-live="polite"></p>
</div>`,
  budget:`<div class="pvc" data-s="ind">
        <div class="sr" role="tablist" aria-label="Run, queue and usage" aria-owns="pvc-t-run pvc-t-queue pvc-t-usage"></div>

        <div class="pvc-c" data-k="run">
          <div class="pvc-in">
            <button type="button" class="pvc-lip" role="tab" id="pvc-t-run" aria-controls="pvc-p-run"><span class="pvc-li" aria-hidden="true"></span><span class="pvc-lt">Indexing the docs</span><span class="pvc-lm num"></span></button>
            <div class="pvc-b" id="pvc-p-run" role="tabpanel" aria-labelledby="pvc-t-run">
              <div class="pvc-act"><span class="tag pvc-st">Starting</span><button type="button" class="ib pvc-pp" aria-label="Pause" data-tip="Pause"></button></div>
              <div class="pvc-sub"><span class="pvc-vt">Preparing the run</span><button type="button" class="pill sm ghost pvc-more" aria-expanded="false" aria-controls="pvc-det">Details<svg class="i xs" aria-hidden="true"><use href="#v2i-chev-d"/></svg></button></div>
              <div class="pvc-tr">
                <div class="pvc-bar" role="progressbar" aria-label="Indexing the docs" aria-valuemin="0" aria-valuemax="100"><i class="pvc-swp"></i></div>
                <div class="pvc-hits" role="group" aria-label="Steps"></div>
                <i class="pvc-mk" aria-hidden="true"></i>
              </div>
              <div class="pvc-ro"></div>
              <div class="fold shut pvc-det" id="pvc-det"><div>
                <p class="pvc-ed" hidden></p>
                <dl class="pvc-kv">
                  <div><dt>Elapsed</dt><dd class="num" data-v="el"></dd></div>
                  <div><dt>Time left</dt><dd class="num" data-v="left"></dd></div>
                  <div><dt>This run</dt><dd class="num" data-v="cr"></dd></div>
                </dl>
              </div></div>
              <div class="pvc-m">
                <div class="pvc-mh"><span class="l"><span class="pvc-k">Credits this month</span><span class="pvc-wt"></span></span><span class="v num"><b data-v="used"></b> of 10,000</span></div>
                <div class="pvc-mw" data-m="run" role="meter" aria-label="Credits this month" aria-valuemin="0" aria-valuemax="10000"></div>
                <div class="pvc-lg num" aria-hidden="true">
                  <span><i class="pvc-dot b"></i><span class="pvc-k">Before</span><b data-v="before"></b></span>
                  <span><i class="pvc-dot r"></i><span class="pvc-k">This run</span><b data-v="spent"></b></span>
                  <span class="pvc-lgp"><i class="pvc-dot p pvc-hp"></i><span class="pvc-k">To finish</span><b data-v="rem"></b></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pvc-c" data-k="queue">
          <div class="pvc-in">
            <button type="button" class="pvc-lip" role="tab" id="pvc-t-queue" aria-controls="pvc-p-queue"><span class="pvc-li" aria-hidden="true"><svg class="i s"><use href="#v2i-list"/></svg></span><span class="pvc-lt">Queue</span><span class="pvc-lm">2 runs waiting</span></button>
            <div class="pvc-b" id="pvc-p-queue" role="tabpanel" aria-labelledby="pvc-t-queue">
              <ul class="pvc-ql">
                <li><span class="t">Index the changelog</span><span class="w">Starts tonight at 2:00</span><span class="c num">about 220 credits</span></li>
                <li><span class="t">Refresh the pricing pages</span><span class="w">Starts tomorrow at 9:00</span><span class="c num">about 120 credits</span></li>
              </ul>
              <p class="pvc-note" data-v="qnote"></p>
            </div>
          </div>
        </div>

        <div class="pvc-c" data-k="usage">
          <div class="pvc-in">
            <button type="button" class="pvc-lip" role="tab" id="pvc-t-usage" aria-controls="pvc-p-usage"><span class="pvc-li" aria-hidden="true"><svg class="i s"><use href="#v2i-gauge"/></svg></span><span class="pvc-lt">Usage this month</span><span class="pvc-lm num" data-v="upct"></span></button>
            <div class="pvc-b" id="pvc-p-usage" role="tabpanel" aria-labelledby="pvc-t-usage">
              <div class="pvc-uh"><span class="v num"><b data-v="uused"></b> of 10,000 credits</span><span class="muted">Resets Dec 1</span></div>
              <div class="pvc-mw" data-m="usage" role="meter" aria-label="Credits this month, with the queue" aria-valuemin="0" aria-valuemax="10000" style="margin-top:10px"></div>
              <div class="pvc-tl num" aria-hidden="true"><span style="left:75%">75%</span><span style="left:90%">90%</span></div>
              <ul class="pvc-ul num">
                <li><i class="pvc-dot b"></i><span class="n">Before this run</span><span class="v" data-v="ub"></span></li>
                <li><i class="pvc-dot r"></i><span class="n">This run so far</span><span class="v" data-v="us"></span></li>
                <li><i class="pvc-dot p pvc-hp"></i><span class="n">To finish this run</span><span class="v" data-v="ur"></span></li>
                <li><i class="pvc-dot q pvc-hq"></i><span class="n">Queue, 2 runs</span><span class="v">about 340</span></li>
                <li class="t"><i class="pvc-dot"></i><span class="n">Left after all of it</span><span class="v" data-v="uf"></span></li>
              </ul>
              <p class="pvc-note">The run warns when it would take the month past 75% or 90%.</p>
            </div>
          </div>
        </div>

        <p class="pvc-sr" aria-live="polite"></p>
      </div>`
};
{
/* ---------- A · progressive disclosure ---------- */
PRG_D.compact = [PRG_HTML.compact, (r, c) => {
  const root = $('.pva', r), stw = $('.pva-st .w', r), btn = $('.pva-btn', r), retryB = $('.pva-retry', r);
  const errF = $('.pva-err', r), errP = $('.pva-err p', r), bar = $('.pva-bar', r), fill = $('.pva-fill', r), eta = $('.pva-eta', r);
  const cr = $('.pva-cr', r), pop = $('.pva-pop', r), tog = $('.pva-tog', r), fold = $('.pva-fold', r), list = $('.pva-list', r), live = $('.pva-live', r);
  const Ih = (n, k = 's') => I(n, k).replace('<svg ', '<svg aria-hidden="true" ');
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const secs = s => s < 60 ? s.toFixed(1) + 's' : clock(s);
  const clock = s => { s = Math.floor(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const set = (el, v, h) => { if (h ? el.innerHTML !== v : el.textContent !== v) h ? el.innerHTML = v : el.textContent = v; };

  /* the run: five steps. Each step's share of the bar is its share of the work (its ticks), so the bar and the time left
     agree; each tick costs the step's credits */
  const SL = ['getting-started', 'install', 'quickstart', 'auth/api-keys', 'auth/oauth', 'webhooks', 'rate-limits', 'errors', 'sdk/node', 'sdk/python', 'pagination', 'search', 'uploads', 'billing', 'changelog', 'migrate-v2'];
  const S = [
    { name:'Reading the sitemap', unit:'pages', total:48, T:6, cost:2, verb:'Reading', now:k => `/docs/${SL[k % 16]}` },
    { name:'Fetching pages', unit:'pages', total:48, T:16, cost:3, verb:'Fetching', now:k => `/docs/${SL[(k * 3) % 16]}` },
    { name:'Indexing files', unit:'files', total:2000, T:26, cost:4, verb:'Indexing', now:k => `docs/${SL[(k * 5) % 16]}${k % 3 ? '.md' : '-' + (k % 4 + 1) + '.png'}` },
    { name:'Writing embeddings', unit:'chunks', total:6400, T:38, cost:9, verb:'Embedding', now:(k, n) => `chunk ${fmt(n)}, ${SL[(k * 7) % 16]}.md` },
    { name:'Checking links', unit:'links', total:310, T:14, cost:2, verb:'Checking', now:k => `/docs/${SL[(k * 11) % 16]}#${['setup', 'examples', 'limits', 'faq'][k % 4]}` }
  ];
  const TICK = 150, ALL = S.reduce((t, s) => t + s.T, 0), RUNCOST = S.reduce((t, s) => t + s.T * s.cost, 0), LIMIT = 10000, FAIL_AT = 19;
  const before = S.map((s, j) => S.slice(0, j).reduce((t, x) => t + x.T, 0));
  // where steps meet on the bar
  bar.insertAdjacentHTML('beforeend', before.slice(1).map(b => `<i class="pva-tk" aria-hidden="true" style="left:${b / ALL * 100}%"></i>`).join(''));

  let state = 'ind', step = 0, sub = 0, spent = 0, elapsed = 0, run = 0, failed = false, monthBase = 7000, band = -1;
  let stat = S.map(() => 'up'), start = [], dur = [], used = [], shown = '';
  const ticks = () => state === 'done' ? ALL : before[step] + sub;
  const count = j => stat[j] === 'done' ? S[j].total : j === step ? Math.round(sub / S[j].T * S[j].total) : 0;
  const left = () => (ALL - ticks()) * TICK / 1000;
  const etaWords = s => s < 3 ? 'A few seconds left' : s < 60 ? `About ${Math.round(s)}s left` : `About ${Math.round(s / 60)} min left`;
  const say = m => { live.textContent = ''; setTimeout(() => { if (!c.dead) live.textContent = m; }, 60); };

  /* ---------- the step list ---------- */
  list.innerHTML = S.map((s, j) => `<li class="pva-s" data-st="up"><div class="pva-sh"></div><div class="fold shut pva-sx" id="pva-x${j}"><div><div class="pva-sxi"></div></div></div></li>`).join('');
  const lis = $$('.pva-s', list);
  const LOG = [
    () => 'Found 48 pages in sitemap.xml.',
    () => 'Fetched all 48 pages.',
    () => 'Indexed 2,000 files from the 48 pages.',
    () => failed ? 'Wrote 6,400 chunks. It timed out once at chunk 3,200 and went on from there after Retry.' : 'Wrote 6,400 chunks.',
    () => 'Checked 310 links. None are broken.'
  ];
  function head(j){
    const s = S[j], st = stat[j];
    const ic = st === 'done' ? Ih('check', 'xs') : st === 'err' ? Ih('alert', 'xs') : st === 'live' ? (state === 'paused' ? Ih('pause', 'xs') : '<span class="spin" aria-hidden="true"></span>') : '<span class="pva-o" aria-hidden="true"></span>';
    const word = { done:', done', err:', failed', live:state === 'paused' ? ', paused' : ', running', up:', not started' }[st];
    return `<span class="pva-si">${ic}</span><span class="pva-sn">${s.name}<span class="sr">${word}</span></span><span class="pva-sc num"></span><span class="pva-sd num"></span><span class="pva-sv">${st === 'done' ? Ih('chev-d', 'xs') : ''}</span>`;
  }
  function detail(j){
    const st = stat[j];
    if (st === 'live') return `<div class="pva-now"><span class="pva-k">${S[j].verb}</span><span class="p"></span></div><div class="pva-sub muted num"></div>`;
    if (st === 'err') return `<p>Stopped at chunk ${fmt(count(j) + 1)}. The ${fmt(count(j))} chunks before it are saved.</p><p class="muted num">Used ${fmt(used[j])} credits, started ${clock(start[j])} into the run.</p>`;
    if (st === 'done') return `<p>${LOG[j]()}</p><p class="muted num">Used ${fmt(used[j])} credits, started ${clock(start[j])} into the run.</p>`;
    return '';
  }
  // a step changes state: its row is drawn again. Done rows fold their detail away and become buttons that open their log
  function restep(j, to){
    const li = lis[j], from = stat[j]; stat[j] = to; li.dataset.st = to;
    const old = $('.pva-sh', li), sx = $('.pva-sx', li), inner = $('.pva-sxi', sx);
    const hd = document.createElement(to === 'done' ? 'button' : 'div'); hd.className = 'pva-sh';
    if (to === 'done'){ hd.type = 'button'; hd.setAttribute('aria-expanded', 'false'); hd.setAttribute('aria-controls', sx.id); hd.onclick = () => { const o = hd.getAttribute('aria-expanded') !== 'true'; hd.setAttribute('aria-expanded', String(o)); sx.classList.toggle('shut', !o); }; }
    hd.innerHTML = head(j); old.replaceWith(hd);
    if (to === 'done' || to === 'up'){
      sx.classList.add('shut');
      if (from === 'up' || REDUCE) inner.innerHTML = detail(j); else c.later(cssT(), () => { if (stat[j] === to) inner.innerHTML = detail(j); });
    } else { inner.innerHTML = detail(j); requestAnimationFrame(() => sx.classList.remove('shut')); }
  }
  lis.forEach((li, j) => { $('.pva-sh', li).innerHTML = head(j); });
  const cssT = () => { const v = getComputedStyle(root).getPropertyValue('--dm-t').trim(); return (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000) || 450; };
  function paintSteps(){
    lis.forEach((li, j) => {
      const s = S[j], st = stat[j], sc = $('.pva-sc', li), sd = $('.pva-sd', li);
      set(sc, st === 'done' ? `${fmt(s.total)} ${s.unit}` : st === 'live' || st === 'err' ? `${fmt(count(j))} of ${fmt(s.total)}` : '');
      if (st === 'done') li.firstElementChild.setAttribute('aria-label', `${s.name}, done, ${fmt(s.total)} ${s.unit} in ${secs(dur[j])}`);
      set(sd, st === 'done' ? secs(dur[j]) : st === 'live' || st === 'err' ? secs(elapsed - start[j]) : '');
      if (st === 'live'){
        const p = $('.pva-now .p', li), sb = $('.pva-sub', li);
        if (p) set(p, s.now(sub, Math.max(1, count(j))));
        if (sb){ const l = (s.T - sub) * TICK / 1000, rest = `${state === 'paused' ? 'paused' : l < 3 ? 'a few seconds left in this step' : `about ${Math.round(l)}s left in this step`}, ${fmt(used[j] || 0)} credits so far`; set(sb, `<span class="nw">${fmt(count(j))} of ${fmt(s.total)} ${s.unit}, ${rest}</span><span class="ww">${rest[0].toUpperCase() + rest.slice(1)}</span>`, true); }
      }
    });
  }

  /* ---------- the surface at rest, and the credits layer ---------- */
  function paint(){
    root.dataset.s = state;
    const p = ticks() / ALL, pc = Math.round(p * 100), sname = S[Math.min(step, S.length - 1)].name;
    // the bar: the whole run
    if (state === 'ind'){ bar.removeAttribute('aria-valuenow'); bar.setAttribute('aria-valuetext', 'Preparing the run'); fill.style.width = ''; }
    else {
      fill.style.width = p * 100 + '%'; bar.setAttribute('aria-valuenow', pc);
      bar.setAttribute('aria-valuetext', { run:`${pc}%, step ${step + 1} of 5, ${etaWords(left()).toLowerCase()}`, paused:`${pc}%, paused`, err:`${pc}%, stopped at step ${step + 1} of 5`, done:'Done' }[state]);
    }
    // the state in words, and the time left
    set(stw, { ind:'Preparing the run', run:`Step ${step + 1} of 5 · ${sname}`, paused:`Paused at step ${step + 1} of 5`, err:`${sname} failed`, done:'Done · 2,000 files indexed, 310 links checked' }[state]);
    set(eta, { ind:'Counting pages', run:`<b>${pc}%</b> · ${etaWords(left())}`, paused:`<b>${pc}%</b> · Paused, ${etaWords(left()).toLowerCase()} once resumed`, err:`<b>${pc}%</b> · Stopped`, done:`<b>100%</b> · Took ${clock(elapsed)}` }[state], true);
    // the Steps toggle: how far, and for how long
    const nd = stat.filter(x => x === 'done').length;
    set($('.n', tog), state === 'err' ? `${nd} of 5 done · 1 failed` : `${nd} of 5 done`);
    set($('.el', tog), `${clock(elapsed)} ${state === 'done' ? 'total' : 'elapsed'}`);
    paintSteps();
    // credits: this run, its projection, and the month with this run's share drawn on it
    const month = monthBase + spent, proj = monthBase + RUNCOST;
    set($('.v', cr), fmt(spent));
    set($('.pva-c-sp', pop), fmt(spent)); set($('.pva-c-pl', pop), state === 'done' ? 'Total' : 'Projected total'); set($('.pva-c-pj', pop), fmt(RUNCOST));
    set($('.pva-c-mo', pop), fmt(month)); set($('.pva-c-a', pop), fmt(monthBase)); set($('.pva-c-b', pop), fmt(spent)); set($('.pva-c-c', pop), fmt(RUNCOST - spent));
    $('.pva-c-cl', pop).hidden = $('.pva-c-sr', pop).hidden = state === 'done';
    const [ma, mb, mc] = $$('.pva-mb i', pop);
    ma.style.width = monthBase / LIMIT * 100 + '%'; mb.style.left = ma.style.width; mb.style.width = spent / LIMIT * 100 + '%';
    mc.style.left = month / LIMIT * 100 + '%'; mc.style.width = (state === 'done' ? 0 : (RUNCOST - spent) / LIMIT * 100) + '%';
    const mtr = $('.pva-mb', pop), nb = month >= 9000 ? 2 : month >= 7500 ? 1 : 0, pb = proj >= 9000 ? 2 : proj >= 7500 ? 1 : 0;
    mtr.setAttribute('aria-valuenow', month); mtr.setAttribute('aria-valuetext', `${fmt(month)} of 10,000 credits used this month, ${fmt(spent)} of them by this run`);
    const lim = ['', '75%', '90%'];
    set($('.pva-wn', pop), nb ? `<span class="tag warn">${Ih('warn', 'xs')}Past ${lim[nb]}</span><span>Over ${lim[nb]} of the month's credits are used. They reset Dec 1.</span>`
      : pb > nb && state !== 'done' ? `<span>This run is on course to take the month past ${lim[pb]}. Credits reset Dec 1.</span>` : '<span>Alerts at 75% and 90%. Credits reset Dec 1.</span>', true);
    // passing a threshold is a change of state: the control gets a warning dot, and it is said once
    if (nb !== band){
      const wd = $('.wd', cr);
      if (nb && !wd) cr.insertAdjacentHTML('beforeend', '<i class="wd" aria-hidden="true"></i>'); else if (!nb && wd) wd.remove();
      if (band >= 0 && nb > band) say(`This month's credits passed ${lim[nb]}`);
      band = nb;
    }
    // what changes only with the state: the button, Retry and the failure sentence
    if (shown !== state){
      const b = state === 'paused' ? ['play', 'Resume'] : state === 'done' ? ['refresh', 'Run again'] : ['pause', 'Pause'];
      const had = document.activeElement === retryB;
      btn.innerHTML = I(b[0]); btn.setAttribute('aria-label', b[1]); btn.dataset.tip = b[1];
      btn.disabled = state === 'ind'; btn.hidden = state === 'err'; retryB.hidden = state !== 'err';
      if (had && state !== 'err') btn.focus({ preventScroll:true });
      if (state === 'err') errP.textContent = `The embeddings service timed out. Nothing written is lost: Retry picks up at chunk ${fmt(count(step) + 1)}.`;
      errF.classList.toggle('shut', state !== 'err');
      lis.forEach((li, j) => { if (stat[j] === 'live') $('.pva-si', li).innerHTML = state === 'paused' ? Ih('pause', 'xs') : '<span class="spin" aria-hidden="true"></span>'; });
      // only a change of state is announced, never every percent
      if (shown) say({ ind:'Starting the run', run:shown === 'err' ? `Retrying from chunk ${fmt(count(step) + 1)}` : 'Running', paused:`Paused at step ${step + 1} of 5`, err:`Step ${step + 1}, ${sname.toLowerCase()}, failed: the embeddings service timed out`, done:`Done. Indexed 2,000 files and checked 310 links in ${clock(elapsed)}` }[state]);
      shown = state;
    }
  }

  /* ---------- the controls ---------- */
  btn.onclick = () => {
    if (state === 'run'){ state = 'paused'; paint(); }
    else if (state === 'paused'){ state = 'run'; paint(); }
    else if (state === 'done'){ monthBase += spent; c.run(go); }
  };
  retryB.onclick = () => { if (state !== 'err') return; state = 'run'; restep(step, 'live'); paint(); };
  tog.onclick = () => { const o = tog.getAttribute('aria-expanded') !== 'true'; tog.setAttribute('aria-expanded', String(o)); fold.classList.toggle('shut', !o); };
  // the credits layer is placed again while the run's surface changes height under it
  const ro = new ResizeObserver(() => { if (pop.classList.contains('open')) placePop(cr, pop); }); ro.observe(root); c.offs.push(() => ro.disconnect());

  // the clock runs while the run prepares or works, not while it is paused or stopped
  let t0 = performance.now();
  c.every(200, () => { const t = performance.now(); if (state === 'run' || state === 'ind'){ elapsed += (t - t0) / 1000; paint(); } t0 = t; });
  // run time is the agent's, so it is not held by a pointer and keeps its pace with reduced motion
  const tick = ms => new Promise((res, rej) => { c.t.push(setTimeout(() => c.dead ? rej('stop') : res(), ms)); });
  const until = async f => { while (!f()) await tick(100); };

  /* the agent's run: it works out what there is, then goes step by step; the fourth step times out once, halfway */
  async function go(){
    const id = ++run;
    state = 'ind'; step = 0; sub = 0; spent = 0; elapsed = 0; failed = false; start = []; dur = []; used = [];
    S.forEach((s, j) => { if (stat[j] !== 'up') restep(j, 'up'); });
    paint();
    await tick(1800); if (id !== run) return;
    state = 'run';
    for (step = 0; step < S.length; step++){
      sub = 0; start[step] = elapsed; used[step] = 0; restep(step, 'live'); paint();
      for (let k = 1; k <= S[step].T; k++){
        await tick(TICK); await until(() => state !== 'paused'); if (id !== run) return;
        if (step === 3 && k === FAIL_AT + 1 && !failed){
          failed = true; state = 'err'; restep(step, 'err'); paint();
          await until(() => state !== 'err'); if (id !== run) return;
          await tick(400); if (id !== run) return;
        }
        sub = k; spent += S[step].cost; used[step] += S[step].cost; paint();
      }
      dur[step] = elapsed - start[step]; restep(step, 'done');
    }
    step = S.length - 1; state = 'done'; paint();
  }
  paint(); c.run(go);

  /* the demo, once: Steps opens, the fourth step fails and is retried, the credits layer opens and closes, and the run
     settles back to its calm surface. It stops for good at the visitor's first click, key or focus inside */
  c.story(async s => {
    await s.until(() => state === 'run' && step === 2 && sub >= 3);
    await s.tap(tog); s.away();
    await s.until(() => state === 'err'); await s.beat(4);
    await s.tap(retryB); s.away(); await s.beat(2);
    await s.tap(cr); await s.beat(6);
    await s.tap(cr); s.away();
    await s.until(() => state === 'done'); await s.beat(3);
    await s.tap(tog); s.away();
    // played once: ending the story here, rather than returning, skips the core's replay loop
    throw 'stop';
  });
}];
}
{
/* ---------- Progress B ---------- */
// an agent at work keeps working while a mouse rests on it (owner, 3 Nov)
PRG_D.steps = [PRG_HTML.steps, (r, c) => {
  const P = ['/docs/getting-started', '/docs/install', '/docs/api/auth', '/docs/api/tokens', '/docs/api/errors', '/docs/guides/webhooks', '/docs/guides/retries', '/docs/guides/rate-limits', '/docs/sdk/node', '/docs/sdk/python', '/docs/changelog', '/docs/faq'];
  const F = P.map(p => p.slice(6) + '.md');
  // the run's steps: what each does, what it counts, how long it takes here (ms), what it costs, and what it leaves behind
  const S = [
    { name:'Reading the sitemap', unit:'pages', total:48, ms:1300, cr:8, made:'48 page addresses from sitemap.xml', items:['/docs/getting-started', '/docs/api/auth', '/docs/guides/webhooks'], now:n => `sitemap.xml, entry ${Math.max(1, n)}` },
    { name:'Fetching pages', unit:'pages', total:48, ms:2600, cr:64, made:'48 pages of HTML, 2.3 MB in all', items:['/docs/api/auth, 41 KB', '/docs/install, 18 KB', '/docs/guides/webhooks, 33 KB'], now:n => 'GET ' + P[n % P.length] },
    { name:'Indexing files', unit:'files', total:2000, ms:3200, cr:120, made:'2,000 files split into 6,400 chunks', items:['api/auth.md, 9 chunks', 'guides/webhooks.md, 14 chunks', 'install.md, 4 chunks'], now:n => F[n % F.length] },
    { name:'Writing embeddings', unit:'chunks', total:6400, ms:3600, cr:260, made:'6,400 vectors in the docs index', items:['api/auth.md, chunks 1 to 9', 'api/tokens.md, chunks 1 to 6', 'guides/retries.md, chunks 1 to 11'], now:n => `${F[Math.floor(n / 9) % F.length]}, chunk ${n % 9 + 1}` },
    { name:'Checking links', unit:'links', total:310, ms:1600, cr:40, made:'310 links checked, none broken', items:['/docs/install, 200', '/docs/api/auth#tokens, 200', '/docs/sdk/node, 200'], now:n => `${P[n % P.length]}, 200` }
  ];
  const N = S.length, MONTH0 = 7080, LIMIT = 10000, FAIL = 3;
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const clock = ms => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const secs = ms => (ms / 1000).toFixed(1) + 's';
  const left = ms => 'about ' + (ms < 60000 ? Math.max(1, Math.ceil(ms / 1000)) + 's' : clock(ms)) + ' left';
  const id = 'pvb' + Math.random().toString(36).slice(2, 7);
  const root = $('.pvb', r), rw = $('.pvb-rw', r), ol = $('.pvb-rail', r), lift = $('.pvb-lift', r), sum = $('.pvb-sum', r), tag = $('.pvb-tag', r), btn = $('.pvb-btn', r), sr = $('.pvb-sr', r);
  const cr = $('.pvb-cr', r), cm = $('.pvb-cm', r), mb = $('.pvb-mb', r), crw = $('.pvb-crw', r);

  // the rows, built once; a step's line becomes a button (it opens) once the step is done
  ol.innerHTML = S.map((s, i) => `<li class="pvb-st" data-k="next">
    <div class="pvb-row"><span class="pvb-nd" aria-hidden="true"></span><span class="pvb-nm"><span class="pvb-vh"></span>${s.name}</span><span class="pvb-mt num"></span></div>
    <div class="pvb-fold pvb-dt" id="${id}-d${i}"><div><div class="pvb-in">
      <p class="pvb-dp"></p><p class="pvb-dm num"></p>
      <span class="pvb-k">First 3 of ${fmt(s.total)}</span>
      <ul class="pvb-ls">${s.items.map(t => `<li>${t}</li>`).join('')}</ul>
    </div></div></div>
    <div class="pvb-fold pvb-lv"><div><div class="pvb-in">
      <div class="pvb-bar" role="progressbar" aria-label="${s.name}" aria-valuemin="0" aria-valuemax="100"><i></i></div>
      <div class="pvb-go"><div class="pvb-nums"><span class="num pvb-cnt"></span><span class="num pvb-rate"></span></div><div class="pvb-now"><span class="pvb-k">Now</span><span class="pvb-nowt"></span></div></div>
      ${i === FAIL ? `<div class="pvb-er"><p class="pvb-em">The embeddings service stopped answering on chunk 3,201. The 3,200 chunks before it are saved, so a retry carries on from there.</p>
        <div class="pvb-ea"><button type="button" class="pill sm primary pvb-retry">${I('refresh', 'xs')}Retry step</button><button type="button" class="pill sm line pvb-logb" aria-expanded="false" aria-controls="${id}-log">View log</button></div>
        <div class="pvb-fold pvb-log" id="${id}-log"><div><div><ol></ol></div></div></div></div>` : ''}
    </div></div></div>
  </li>`).join('') + `<li class="pvb-st pvb-fin" data-k="next">
    <div class="pvb-row"><span class="pvb-nd" aria-hidden="true">${I('flag', 'xs')}</span><span class="pvb-nm"><span class="pvb-vh"></span>Index ready</span><span class="pvb-mt num"></span></div>
    <div class="pvb-fold pvb-lv"><div><div class="pvb-in"><p class="pvb-dp">2,000 files and 6,400 chunks are searchable now.</p><p class="pvb-dm num"></p></div></div></div>
  </li>`;
  const rows = $$('.pvb-st', ol).map((li, i) => ({ li, i, k:'', nd:'', s:S[i],
    dt:$('.pvb-dt', li), lv:$('.pvb-lv', li), bar:$('.pvb-bar', li), cnt:$('.pvb-cnt', li), rate:$('.pvb-rate', li), nowt:$('.pvb-nowt', li), mt:$('.pvb-mt', li), vh:$('.pvb-vh', li) }));
  const fin = rows[N], retryB = $('.pvb-retry', r), logB = $('.pvb-logb', r), log = $('.pvb-log', r);

  let run = 0, st = 'ind', cur = 0, sub = 0, el = 0, stepEl = [], runCr = 0, failed = false, retries = 0, nowAt = -1e9, openI = -1, shownState = '', shownBand = -1, failAt = 0;

  // ---- the live card: one raised surface that follows the step in hand, gliding down the rail when it moves on
  let at = null, glide = null;
  const D = () => parseFloat(getComputedStyle(root).getPropertyValue('--dm-t')) * 1000 || 450;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const moveLift = () => { glide = at && !REDUCE ? { from:{ ...at }, t0:performance.now(), d:D() } : null; };
  c.loop(t => {
    const L = rows.find(x => x.k === 'live' || x.k === 'end'); if (!L){ lift.classList.remove('on'); return; }
    const to = { y:L.li.offsetTop, h:L.li.offsetHeight }; let now = to;
    if (glide){ const p = Math.min(1, (performance.now() - glide.t0) / glide.d), e = ease(p); now = { y:glide.from.y + (to.y - glide.from.y) * e, h:glide.from.h + (to.h - glide.from.h) * e }; if (p >= 1) glide = null; }
    if (!at || at.y !== now.y || at.h !== now.h){ lift.style.transform = `translateY(${now.y}px)`; lift.style.height = now.h + 'px'; at = now; }
    lift.classList.add('on');
  });

  // ---- a step's line: done (a button that opens its detail), live or ahead
  function setKind(R, k){
    const was = R.k; R.k = k; R.li.dataset.k = k;
    const row = $('.pvb-row', R.li), inner = row.innerHTML.replace(/<svg class="i s pvb-cv"[\s\S]*?<\/svg>/, '');
    if (k === 'done' && R.s){
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pvb-row'; b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', R.dt.id);
      b.innerHTML = inner + `<svg class="i s pvb-cv" aria-hidden="true"><use href="#v2i-chev-d"/></svg>`; b.onclick = () => openStep(R.i === openI ? -1 : R.i);
      row.replaceWith(b);
    } else if (row.tagName === 'BUTTON'){ const d = document.createElement('div'); d.className = 'pvb-row'; d.innerHTML = inner; row.replaceWith(d); }
    R.mt = $('.pvb-mt', R.li); R.vh = $('.pvb-vh', R.li);
    R.lv.classList.toggle('open', k === 'live' || k === 'end');
    if (k !== 'done' && R.dt){ R.dt.classList.remove('open'); if (openI === R.i) openI = -1; }
    if ((k === 'live' || k === 'end') && was && was !== k) moveLift();
    R.nd = '';
  }
  function node(R, key, html){ if (R.nd === key) return; R.nd = key; $('.pvb-nd', R.li).innerHTML = html; }
  function openStep(i){
    openI = i;
    rows.forEach(R => { if (!R.dt) return; const on = R.i === i && R.k === 'done', b = $('button.pvb-row', R.li); R.dt.classList.toggle('open', on); if (b) b.setAttribute('aria-expanded', String(on)); });
  }

  // ---- paint: everything follows the run's state
  function paint(){
    root.dataset.s = st;
    rows.forEach(R => {
      const k = R === fin ? (st === 'done' ? 'end' : 'next') : st === 'done' || R.i < cur ? 'done' : R.i === cur ? 'live' : 'next';
      if (R.k !== k) setKind(R, k);
      const s = R.s;
      if (k === 'done'){
        node(R, 'done', I('check', 'xs')); R.vh.textContent = 'Done: ';
        const took = stepEl[R.i] || s.ms, extra = R.i === FAIL && retries ? `, after ${retries} retry` : '';
        R.mt.textContent = `${fmt(s.total)} ${s.unit} · ${secs(took)}`;
        $('.pvb-dp', R.dt).textContent = s.made + extra;
        $('.pvb-dm', R.dt).textContent = `${secs(took)} · ${fmt(s.total / (took / 1000))} ${s.unit}/s · ${fmt(s.cr)} credits`;
      } else if (k === 'next'){
        node(R, 'next', R === fin ? I('flag', 'xs') : ''); R.vh.textContent = 'Up next: ';
        R.mt.textContent = s ? `${fmt(s.total)} ${s.unit}` : '';
      } else if (k === 'end'){
        node(R, 'end', I('check', 'xs')); R.vh.textContent = 'Done: '; R.mt.textContent = clock(el);
        $('.pvb-dm', R.li).textContent = `${clock(el)} in all · ${fmt(runCr)} credits` + (retries ? ` · ${retries} retry` : '');
      } else {
        node(R, st, st === 'paused' ? I('pause', 'xs') : st === 'err' ? I('alert', 'xs') : '<span class="spin"></span>');
        R.vh.textContent = { ind:'Starting: ', run:'Running: ', paused:'Paused: ', err:'Failed: ' }[st];
        const n = Math.round(sub * s.total), se = stepEl[R.i] || 0;
        R.bar.classList.toggle('ind', st === 'ind');
        if (st === 'ind'){
          R.bar.removeAttribute('aria-valuenow'); R.bar.setAttribute('aria-valuetext', 'Working out how much there is');
          R.cnt.textContent = 'Counting pages'; R.rate.textContent = ''; R.nowt.textContent = 'sitemap.xml'; R.mt.textContent = 'Starting';
        } else {
          R.bar.firstElementChild.style.width = sub * 100 + '%';
          R.bar.setAttribute('aria-valuenow', Math.round(sub * 100)); R.bar.setAttribute('aria-valuetext', `${fmt(n)} of ${fmt(s.total)} ${s.unit}`);
          R.cnt.textContent = `${fmt(n)} of ${fmt(s.total)} ${s.unit}`;
          R.rate.textContent = se >= 300 ? `${fmt(n / (se / 1000))} ${s.unit}/s` : 'measuring';
          // the item it is on changes a few times a second, not every tick, so it stays readable
          if (st === 'run' && el - nowAt >= 400){ R.nowt.textContent = s.now(n); nowAt = el; }
          R.mt.textContent = st === 'paused' ? 'Paused' : st === 'err' ? 'Timed out' : sub > .08 ? left(se / sub * (1 - sub)) : 'estimating';
        }
      }
    });
    // the header: the run in words, which is also its progress bar for assistive tech
    const weight = S.reduce((t, s) => t + s.ms, 0), doneMs = S.slice(0, Math.min(cur, N)).reduce((t, s) => t + s.ms, 0);
    const pct = st === 'done' ? 100 : Math.round((doneMs + sub * (S[cur] ? S[cur].ms : 0)) / weight * 100);
    const se = stepEl[cur] || 0, stepLeft = st === 'run' && sub > .08 ? se / sub * (1 - sub) : (1 - sub) * (S[cur] ? S[cur].ms : 0);
    const rem = stepLeft + S.slice(cur + 1).reduce((t, s) => t + s.ms, 0);
    const words = { ind:'Preparing the run',
      run:`Step ${cur + 1} of ${N} · ${clock(el)} · ${left(rem)}`,
      paused:`Paused at step ${cur + 1} of ${N} · ${clock(el)}`,
      err:`Step ${cur + 1} of ${N} failed · ${clock(el)}`,
      done:`Done in ${clock(el)} · 2,000 files indexed` }[st];
    if (sum.textContent !== words) sum.textContent = words;
    if (st === 'ind'){ sum.removeAttribute('aria-valuenow'); sum.setAttribute('aria-valuetext', 'Preparing the run'); }
    else { sum.setAttribute('aria-valuenow', pct); sum.setAttribute('aria-valuetext', st === 'done' ? 'Done, all 5 steps' : `${pct}% of the run, step ${cur + 1} of ${N}`); }
    if (shownState !== st){
      swap(tag, { ind:'Starting', run:'Running', paused:'Paused', err:'Failed', done:'Done' }[st]);
      tag.className = 'tag pvb-tag ' + ({ run:'run', err:'bad', done:'ok' }[st] || '');
      const b = st === 'paused' ? ['play', 'Resume'] : st === 'done' ? ['refresh', 'Run again'] : ['pause', 'Pause'];
      const hadFocus = document.activeElement === btn;
      btn.innerHTML = I(b[0], ''); btn.setAttribute('aria-label', b[1]); btn.dataset.tip = b[1];
      btn.disabled = st === 'ind'; btn.hidden = st === 'err';
      if (hadFocus && st === 'err') retryB.focus();
      // only a change of state is announced, never every count
      if (shownState) sr.textContent = { ind:'Starting the run', run:shownState === 'paused' ? 'Resumed' : shownState === 'err' ? `Retrying step ${cur + 1}` : 'Running', paused:'Paused', err:`Step ${cur + 1}, ${S[FAIL].name.toLowerCase()}, failed: the embeddings service timed out. Retry is on the step.`, done:`Run done in ${clock(el)}, 2,000 files indexed` }[st];
      shownState = st;
    }
    // the footer: this run and the month, in one line; the meter waits behind it
    const month = MONTH0 + runCr, m = month / LIMIT, band = m >= .9 ? 2 : m >= .75 ? 1 : 0;
    $('.pvb-rc', r).textContent = fmt(runCr); $('.pvb-mc', r).textContent = fmt(month); $('.pvb-mr', r).textContent = fmt(runCr);
    $('.fl', mb).style.width = m * 100 + '%'; const rn = $('.rn', mb); rn.style.left = MONTH0 / LIMIT * 100 + '%'; rn.style.width = runCr / LIMIT * 100 + '%';
    mb.classList.toggle('warn', band === 1); mb.classList.toggle('bad', band === 2); $('.pvb-ml', r).style.setProperty('--mtr', ['var(--accent-mark)', 'var(--warn-mark)', 'var(--bad)'][band]);
    mb.setAttribute('aria-valuenow', Math.round(month)); mb.setAttribute('aria-valuetext', `${fmt(month)} of 10,000 credits this month, ${fmt(runCr)} from this run` + ['', ', running low', ', almost out'][band]);
    if (band !== shownBand){
      crw.innerHTML = ['', `<span class="tag warn">${I('warn', 'xs')}<span class="lbl">Running low</span></span>`, `<span class="tag bad">${I('alert', 'xs')}<span class="lbl">Almost out</span></span>`][band];
      if (shownBand >= 0 && band){ enter(crw.firstElementChild); sr.textContent = `Credits running low: ${fmt(month)} of 10,000 used this month`; }
      shownBand = band;
    }
  }

  // ---- what a person can do
  function retry(){ if (st !== 'err') return; showLog(false); st = 'run'; paint(); if (r.contains(document.activeElement) && !document.activeElement.offsetParent) btn.focus(); }
  function showLog(on){ log.classList.toggle('open', on); logB.setAttribute('aria-expanded', String(on)); logB.textContent = on ? 'Hide log' : 'View log'; }
  retryB.onclick = retry;
  logB.onclick = () => showLog(logB.getAttribute('aria-expanded') !== 'true');
  btn.onclick = () => {
    if (st === 'run'){ st = 'paused'; paint(); }
    else if (st === 'paused'){ st = 'run'; paint(); }
    else if (st === 'done') c.run(go);
  };
  cr.onclick = () => { const on = cr.getAttribute('aria-expanded') !== 'true'; cr.setAttribute('aria-expanded', String(on)); cm.classList.toggle('open', on); };

  // ---- the agent's run: it works out what there is, then goes step by step; the fourth step times out once
  const until = async f => { while (!f()) await c.wait(100); };
  const TICK = 100;
  async function go(){
    const me = ++run;
    st = 'ind'; cur = 0; sub = 0; el = 0; stepEl = S.map(() => 0); runCr = 0; failed = false; retries = 0; nowAt = -1e9;
    openStep(-1); showLog(false); paint();
    for (let k = 0; k < 18; k++){ await c.wait(TICK); if (me !== run) return; el += TICK; paint(); }
    st = 'run';
    for (cur = 0; cur < N; cur++){
      sub = 0; nowAt = -1e9; paint();
      while (sub < 1){
        await c.wait(TICK); await until(() => st !== 'paused'); if (me !== run) return;
        const s = S[cur]; let nx = Math.min(1, sub + TICK / s.ms);
        if (cur === FAIL && !failed && nx >= .5) nx = .5;
        runCr += s.cr * (nx - sub); sub = nx; el += TICK; stepEl[cur] += TICK; paint();
        if (cur === FAIL && !failed && sub === .5){
          failed = true; failAt = el; st = 'err';
          const t = ms => `<time class="num">${clock(ms)}</time>`;
          $('ol', log).innerHTML = `<li>${t(failAt - 300)}<span>Sent chunks 3,201 to 3,248 to the embeddings service</span></li><li>${t(failAt)}<span>No answer before the time limit</span></li><li>${t(failAt)}<span>Step stopped, 3,200 of 6,400 chunks saved</span></li>`;
          paint(); await until(() => st !== 'err'); if (me !== run) return;
          retries++; nowAt = -1e9;
        }
      }
    }
    cur = N; st = 'done'; paint();
  }
  paint(); c.run(go);

  // the preview's story: the fourth step fails, the person reads the log and retries, and once it is done opens a step.
  // It plays once, then the run stays as it is for the visitor
  c.story(async s => {
    await s.until(() => st === 'err'); await s.beat(2);
    await s.tap(logB); await s.beat(3);
    await s.tap(retryB); s.away();
    await s.until(() => st === 'done'); await s.beat(3);
    await s.tap($('button.pvb-row', rows[2].li)); s.away();
    await s.until(() => false);
  });
}];
}
{
/* ---------- C: budget-aware layered meter ---------- */
const ic = (n, c = 's') => `<svg class="i ${c}" aria-hidden="true"><use href="#v2i-${n}"/></svg>`;
const fmt = n => Math.round(n).toLocaleString('en-US');
const clock = ms => { const s = Math.round(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
// the run's steps: what each counts, how long it should take in this demo, and what it should cost
const STEPS = [
  { name:'Reading the sitemap', unit:'pages', total:48, ms:1000, cr:20 },
  { name:'Fetching pages', unit:'pages', total:48, ms:2000, cr:200 },
  { name:'Indexing files', unit:'files', total:2000, ms:2600, cr:380 },
  { name:'Writing embeddings', unit:'chunks', total:6400, ms:3600, cr:1000 },
  { name:'Checking links', unit:'links', total:310, ms:1400, cr:100 }
];
const MS = STEPS.reduce((t, s) => t + s.ms, 0), TOTAL = STEPS.reduce((t, s) => t + s.cr, 0);
// the month: 10,000 credits, 5,700 used before this run; the batch that fails is billed anyway; two runs wait in the queue
const LIMIT = 10000, START = 5700, LOST = 250, QUEUED = 340, T75 = 7500, T90 = 9000;
const cap = s => s[0].toUpperCase() + s.slice(1);

PRG_D.budget = [PRG_HTML.budget, (r, c) => {
  const root = $('.pvc', r), cards = $$('.pvc-c', r), K = ['run', 'queue', 'usage'];
  const card = k => $(`.pvc-c[data-k="${k}"]`, r), lip = k => $('.pvc-lip', card(k)), panel = k => $('.pvc-b', card(k));
  const V = n => $(`[data-v="${n}"]`, r);
  const tag = $('.pvc-st', r), pp = $('.pvc-pp', r), vt = $('.pvc-vt', r), more = $('.pvc-more', r), det = $('.pvc-det', r), ed = $('.pvc-ed', r);
  const tr = $('.pvc-tr', r), bar = $('.pvc-bar', r), hitBox = $('.pvc-hits', r), mk = $('.pvc-mk', r), ro = $('.pvc-ro', r), sr = $('.pvc-sr', r), wt = $('.pvc-wt', r);
  const runIcon = $('.pvc-c[data-k="run"] .pvc-li', r), runMeta = $('.pvc-c[data-k="run"] .pvc-lm', r);
  // the bar's five parts and, over them, one button per step to read it
  bar.insertAdjacentHTML('beforeend', STEPS.map(s => `<i class="pvc-sg" style="width:${(s.ms / MS * 100).toFixed(3)}%"><b></b></i>`).join(''));
  hitBox.innerHTML = STEPS.map((s, i) => `<button type="button" class="pvc-hit" tabindex="${i ? -1 : 0}" style="width:${(s.ms / MS * 100).toFixed(3)}%"></button>`).join('');
  const segs = $$('.pvc-sg', r), hits = $$('.pvc-hit', r);

  /* ---- the month's meter, drawn twice: on the run, and in full on the usage card with the queue ---- */
  function meter(box, withQ){
    box.innerHTML = `<div class="pvc-mb"><i class="b"></i><i class="r"></i><i class="p pvc-hp"></i>${withQ ? '<i class="q pvc-hq"></i>' : ''}</div><i class="pvc-th" style="left:75%"></i><i class="pvc-th" style="left:90%"></i>`;
    const [b, rn, p, q] = $$('.pvc-mb i', box), th = $$('.pvc-th', box);
    const pc = x => Math.max(0, Math.min(100, x / LIMIT * 100));
    const place = (el, from, w) => { el.style.left = pc(from) + '%'; el.style.width = (pc(from + w) - pc(from)) + '%'; el.classList.toggle('z', w <= 0); };
    return m => {
      place(b, 0, m.before); place(rn, m.before, m.spent); place(p, m.before + m.spent, m.rem);
      if (q) place(q, m.end, QUEUED);
      // a threshold the run will cross lights up
      th[0].classList.toggle('x', m.end >= T75); th[1].classList.toggle('x', m.end >= T90);
    };
  }
  const mRun = meter($('[data-m="run"]', r), false), mUse = meter($('[data-m="usage"]', r), true);

  /* ---- the run ---- */
  let state = 'ind', step = 0, sub = 0, el = 0, lost = 0, before = START, failed = false, run = 0, hot = -1;
  const stepMs = [0, 0, 0, 0, 0];
  let shownState = '', shownBand = -1, shownRo = '';
  const prog = i => state === 'done' ? 1 : state === 'ind' ? 0 : i < step ? 1 : i === step ? sub : 0;
  const spentAt = i => STEPS[i].cr * prog(i) + (i === 3 ? lost : 0);
  function numbers(){
    const spent = STEPS.reduce((t, s, i) => t + spentAt(i), 0), est = state === 'ind' ? null : TOTAL + lost;
    const rem = est == null || state === 'done' ? 0 : Math.max(0, est - spent), used = before + spent, end = est == null ? used : before + est;
    const doneMs = STEPS.reduce((t, s, i) => t + s.ms * prog(i), 0);
    return { spent, est, rem, used, end, before, doneMs, pct:Math.round(doneMs / MS * 100) };
  }
  // what one step says when you point at it: done, in hand, stopped, or still to come
  function stepInfo(i){
    const s = STEPS[i], p = prog(i), cr = fmt(spentAt(i));
    if (state === 'ind') return { line:'Not started yet', say:'not started' };
    if (p >= 1) return { line:`${fmt(s.total)} ${s.unit} · ${clock(stepMs[i])} · ${cr} credits`, say:`done, ${fmt(s.total)} ${s.unit} in ${clock(stepMs[i])}, ${cr} credits${i === 3 && lost ? `, ${fmt(lost)} of them for the batch that failed` : ''}` };
    if (i === step && state === 'err') return { line:`${fmt(p * s.total)} of ${fmt(s.total)} ${s.unit} · stopped · ${cr} credits`, say:`failed at ${fmt(p * s.total)} of ${fmt(s.total)} ${s.unit}, ${cr} credits so far` };
    if (i === step) return { line:`${fmt(p * s.total)} of ${fmt(s.total)} ${s.unit} · ${clock(stepMs[i])} · ${cr} credits`, say:`${state === 'paused' ? 'paused' : 'running'}, ${fmt(p * s.total)} of ${fmt(s.total)} ${s.unit}, ${cr} credits so far` };
    return { line:`about ${clock(s.ms)} · about ${fmt(s.cr)} credits`, say:`to come, about ${clock(s.ms)} and ${fmt(s.cr)} credits` };
  }
  const TAG = { ind:['Starting', ''], run:['Running', 'run'], paused:['Paused', ''], err:['Failed', 'bad'], done:['Done', 'ok'] };
  function paint(){
    const n = numbers(), S = STEPS[Math.min(step, 4)];
    root.dataset.s = state;
    // the bar
    segs.forEach((g, i) => { g.firstChild.style.setProperty('--f', prog(i)); g.classList.toggle('bad', state === 'err' && i === step); });
    if (state === 'ind'){ bar.removeAttribute('aria-valuenow'); bar.setAttribute('aria-valuetext', 'Preparing the run'); }
    else { bar.setAttribute('aria-valuenow', n.pct); bar.setAttribute('aria-valuetext', state === 'done' ? 'Done, all 5 steps' : `${n.pct}%, step ${step + 1} of 5, ${S.name.toLowerCase()}${state === 'err' ? ', failed' : state === 'paused' ? ', paused' : ''}`); }
    hits.forEach((h, i) => h.setAttribute('aria-label', `Step ${i + 1}, ${STEPS[i].name}: ${stepInfo(i).say}`));
    runMeta.textContent = state === 'run' ? n.pct + '%' : TAG[state][0];
    // the words
    const words = { ind:'Preparing the run', run:`Step ${step + 1} of 5, ${S.name.toLowerCase()}`, paused:`Paused at step ${step + 1} of 5`, err:`Failed at step ${step + 1} of 5`, done:`Indexed 2,000 files in ${clock(el)}` }[state];
    if (vt.textContent !== words) vt.textContent = words;
    // the line under the bar
    let roH;
    if (hot >= 0) roH = `<span class="a"><b>${hot + 1}</b> · ${STEPS[hot].name}</span><span class="z num">${stepInfo(hot).line}</span>`;
    else if (state === 'err') roH = 'err';
    else if (state === 'ind') roH = '<span class="a">Counting pages</span><span class="z"></span>';
    else if (state === 'done') roH = `<span class="a">All 5 steps done</span><span class="z num"><b>${fmt(n.spent)}</b> credits</span>`;
    else roH = `<span class="a pvc-k">${cap(S.unit)}</span><span class="z num"><b>${fmt(sub * S.total)}</b> of ${fmt(S.total)}</span>`;
    if (roH !== shownRo){
      const back = ro.contains(document.activeElement);
      ro.innerHTML = roH === 'err' ? `<span class="pvc-e">${ic('alert', 'xs')}<span>The embeddings service timed out</span></span><button type="button" class="pill sm line pvc-retry">${ic('refresh', 'xs')}Retry</button>` : roH;
      if (roH === 'err'){ $('.pvc-retry', ro).onclick = retry; if (shownRo !== 'err') enter(ro.firstElementChild); }
      if (back && !ro.contains(document.activeElement)) pp.focus({ preventScroll:true });
      shownRo = roH;
    }
    // details
    ed.hidden = state !== 'err';
    if (state === 'err') ed.textContent = `Batch 3 of 4 got no answer and was billed anyway, ${fmt(LOST)} credits. Chunks 1 to 3,200 are saved, so Retry starts at chunk 3,201.`;
    V('el').textContent = clock(el);
    V('left').textContent = { ind:'Working it out', err:'On hold', paused:'On hold', done:'Finished' }[state] || 'about ' + clock(MS - n.doneMs);
    V('cr').textContent = n.est == null ? fmt(n.spent) : state === 'done' ? fmt(n.spent) : `${fmt(n.spent)} of ${fmt(n.est)}`;
    // the state: tag, button, and the one line a screen reader hears
    let say = '';
    if (shownState !== state){
      swap(tag, TAG[state][0]); tag.className = 'tag pvc-st ' + TAG[state][1];
      const b = state === 'paused' ? ['play', 'Resume'] : state === 'done' ? ['refresh', 'Run again'] : ['pause', 'Pause'];
      pp.innerHTML = ic(b[0]); pp.setAttribute('aria-label', b[1]); pp.dataset.tip = b[1];
      pp.disabled = state === 'ind'; pp.classList.toggle('gone', state === 'err');
      runIcon.innerHTML = { ind:'<span class="spin"></span>', run:'<span class="spin"></span>', paused:ic('pause', 'xs'), err:ic('alert', 'xs'), done:ic('check', 'xs') }[state];
      if (shownState) say = { ind:'Starting the run', run:shownState === 'err' ? 'Retrying step 4' : shownState === 'paused' ? 'Resumed' : 'Running', paused:'Paused', err:'Step 4 failed: the embeddings service timed out. Retry is under the bar.', done:'Done. ' + words }[state];
      shownState = state;
    }
    // the month, on the run and on the usage card
    const m = { before:n.before, spent:n.spent, rem:n.rem, end:n.end };
    mRun(m); mUse(m);
    V('used').textContent = fmt(n.used); V('before').textContent = fmt(n.before); V('spent').textContent = fmt(n.spent);
    $('.pvc-lgp', r).hidden = state === 'done'; V('rem').textContent = n.est == null ? 'working it out' : state === 'done' ? '0' : fmt(n.rem);
    const mt = `${fmt(n.used)} of 10,000 credits used, ${fmt(n.spent)} of them by this run` + (n.est == null ? '' : state === 'done' ? '' : `, about ${fmt(n.rem)} more to finish it, ${fmt(n.end)} in all`);
    const mw = $('[data-m="run"]', r); mw.setAttribute('aria-valuenow', Math.round(n.used)); mw.setAttribute('aria-valuetext', mt);
    const uw = $('[data-m="usage"]', r); uw.setAttribute('aria-valuenow', Math.round(n.used)); uw.setAttribute('aria-valuetext', mt + `, and about ${fmt(QUEUED)} for the queue`);
    V('uused').textContent = fmt(n.used); V('upct').textContent = Math.floor(n.used / LIMIT * 100) + '%';
    V('ub').textContent = fmt(n.before); V('us').textContent = fmt(n.spent);
    V('ur').textContent = n.est == null ? 'working it out' : state === 'done' ? '0' : 'about ' + fmt(n.rem);
    V('uf').textContent = 'about ' + fmt(Math.max(0, LIMIT - n.end - QUEUED));
    const qe = n.end + QUEUED;
    V('qnote').textContent = `With both, the month comes to about ${fmt(Math.round(qe / 10) * 10)} of 10,000 credits${qe >= T90 ? ', past 90%' : qe >= T75 ? ', past 75%' : ''}.`;
    // the warning: only once the run's projection crosses a threshold
    const band = n.end >= T90 ? 2 : n.end >= T75 ? 1 : 0;
    if (band !== shownBand){
      const t = band === 2 ? T90 : T75, past = n.used >= t;
      wt.innerHTML = band ? `<span class="tag ${band === 2 ? 'bad' : 'warn'}">${ic(band === 2 ? 'alert' : 'warn', 'xs')}${past ? 'Past' : 'Will pass'} ${band === 2 ? 90 : 75}%</span>` : '';
      if (band && shownBand >= 0){ enter(wt.firstElementChild); say = (say ? say + '. ' : '') + `This run will take the month past ${band === 2 ? 90 : 75}% of its credits`; }
      shownBand = band;
    } else if (band){
      const t = band === 2 ? T90 : T75, txt = `${n.used >= t ? 'Past' : 'Will pass'} ${band === 2 ? 90 : 75}%`, tg = $('.tag', wt);
      if (tg && tg.lastChild.textContent !== txt) tg.lastChild.textContent = txt;
    }
    if (say){ sr.textContent = ''; setTimeout(() => { sr.textContent = say; }, 60); }
  }
  function retry(){ if (state !== 'err') return; state = 'run'; paint(); }
  pp.onclick = () => {
    if (state === 'run'){ state = 'paused'; paint(); }
    else if (state === 'paused'){ state = 'run'; paint(); }
    else if (state === 'done'){ before = numbers().used; c.run(go); }
  };
  const until = async f => { while (!f()) await c.wait(100); };
  // the agent's run: it works out what there is, then goes step by step; the fourth step times out once
  async function go(){
    const id = ++run; state = 'ind'; step = 0; sub = 0; el = 0; lost = 0; stepMs.fill(0); paint();
    await c.wait(1600); if (id !== run) return;
    state = 'run';
    for (step = 0; step < STEPS.length; step++){
      sub = 0; paint(); const dt = STEPS[step].ms / 12;
      for (let k = 1; k <= 12; k++){
        await c.wait(dt); await until(() => state !== 'paused'); if (id !== run) return;
        if (step === 3 && k === 7 && !failed){
          failed = true; lost = LOST; state = 'err'; paint();
          await until(() => state !== 'err'); if (id !== run) return;
          await c.wait(400); if (id !== run) return;
        }
        sub = k / 12; stepMs[step] += dt; el += dt; paint();
      }
    }
    step = STEPS.length - 1; state = 'done'; paint();
  }

  /* ---- details, on demand ---- */
  c.on(more, 'click', () => { const open = more.getAttribute('aria-expanded') !== 'true'; more.setAttribute('aria-expanded', String(open)); det.classList.toggle('shut', !open); });

  /* ---- the scrubber: point at the bar, or move along the steps with the arrow keys ---- */
  function scrub(i, x){
    hot = i; tr.classList.toggle('scr', i >= 0);
    segs.forEach((g, j) => g.classList.toggle('hot', j === i));
    if (i >= 0){ const b = segs[i]; mk.style.left = (x != null ? x : b.offsetLeft + b.offsetWidth / 2) + 'px'; }
    paint();
  }
  const at = x => { let i = 0; segs.forEach((g, j) => { if (x >= g.offsetLeft) i = j; }); return i; };
  c.on(tr, 'pointermove', e => { if (e.pointerType === 'touch') return; const x = Math.max(0, Math.min(tr.clientWidth, e.clientX - tr.getBoundingClientRect().left)); scrub(at(x), x); });
  c.on(tr, 'pointerleave', () => { if (!tr.contains(document.activeElement)) scrub(-1); else scrub(hits.indexOf(document.activeElement)); });
  hits.forEach((h, i) => { c.on(h, 'focus', () => scrub(i)); c.on(h, 'click', () => scrub(i)); });
  c.on(hitBox, 'focusout', e => { if (!hitBox.contains(e.relatedTarget)) scrub(-1); });
  c.on(hitBox, 'keydown', e => {
    const i = hits.indexOf(document.activeElement); if (i < 0) return;
    const to = { ArrowRight:i + 1, ArrowDown:i + 1, ArrowLeft:i - 1, ArrowUp:i - 1, Home:0, End:4 }[e.key];
    if (e.key === 'Escape'){ scrub(-1); return; }
    if (to == null) return; e.preventDefault();
    const j = Math.max(0, Math.min(4, to)); hits.forEach((h, k) => h.tabIndex = k === j ? 0 : -1); hits[j].focus();
  });

  /* ---- the pile: one card in front, the others peeking out behind it ---- */
  let front = 'run', swT = 0;
  const pk = () => parseFloat(getComputedStyle(root).getPropertyValue('--pk')) || 36;
  function fit(){
    const h = $('.pvc-in', card(front)).offsetHeight;
    cards.forEach(cd => { cd.style.height = h + 'px'; });
    root.style.height = (pk() * 2 + h) + 'px';
  }
  function layout(){
    const rest = K.filter(k => k !== front);
    cards.forEach(cd => {
      const k = cd.dataset.k, d = k === front ? 0 : rest.indexOf(k) + 1;
      cd.dataset.d = d; cd.style.zIndex = 3 - d;
      lip(k).setAttribute('aria-selected', String(d === 0)); lip(k).tabIndex = d === 0 ? 0 : -1;
      panel(k).inert = d !== 0;
    });
    fit();
  }
  // a card comes to the front: it lifts out of the pile first, then lands on top as the others step back
  function bring(k){
    if (k === front) return;
    const cd = card(k), d = +cd.dataset.d;
    if (hot >= 0) scrub(-1);
    hideTip(true);
    root.classList.add('swap'); clearTimeout(swT);
    const land = () => { cd.style.transform = ''; cd.style.transitionDuration = ''; front = k; layout(); swT = setTimeout(() => root.classList.remove('swap'), 800); };
    if (REDUCE){ land(); return; }
    cd.style.transitionDuration = '.2s';
    cd.style.transform = `translateY(calc(var(--pk) * -${d} - 22px)) scale(${1 - .05 * d})`;
    setTimeout(() => { if (!c.dead) land(); }, 170);
  }
  K.forEach(k => c.on(lip(k), 'click', () => bring(k)));
  // the tabs: arrow keys move between the cards and bring each to the front as they go; Home and End go to the ends
  K.forEach(k => c.on(lip(k), 'keydown', e => {
    const i = K.indexOf(k), to = { ArrowRight:i + 1, ArrowDown:i + 1, ArrowLeft:i - 1, ArrowUp:i - 1, Home:0, End:2 }[e.key];
    if (to == null) return; e.preventDefault();
    const n = K[(to + 3) % 3]; bring(n); lip(n).focus({ preventScroll:true });
  }));
  const ro2 = new ResizeObserver(() => fit()); $$('.pvc-in', r).forEach(x => ro2.observe(x)); c.offs.push(() => ro2.disconnect());
  layout();
  paint(); c.run(go);

  // the story, once: the person reads a finished step on the bar, opens the details when step 4 fails, retries it,
  // and once the run is done brings the month's usage to the front and goes back to the run. Then it is all theirs
  c.taken(() => { if (hot >= 0 && !tr.matches(':hover') && !hitBox.contains(document.activeElement)) scrub(-1); });
  c.story(async s => {
    await s.until(() => state === 'run' && step === 2 && sub >= .25);
    await s.point(hits[1], false); scrub(1); await s.beat(4); if (!tr.matches(':hover')) scrub(-1); s.away();
    await s.until(() => state === 'err'); await s.beat(2);
    await s.tap(more); await s.beat(5);
    await s.tap($('.pvc-retry', r)); await s.beat(1); s.away();
    await s.until(() => state === 'done'); await s.beat(3);
    await s.tap(lip('usage')); await s.beat(1); s.away(); await s.beat(6);
    await s.tap(lip('run')); await s.beat(1); s.away();
    await new Promise(() => {});
  });
}];
}
  // a pick draws the design in place and plays its run from the start, on a controller of its own inside the card's; the
  // card keeps the pick when it plays again or is replayed
  function prgDesigns(r, c){
    const main = $('.dm-main', r), sg = $('.demo .seg2', r), card = c.card || r;
    let k = null, at = PRG_D[card._prgDesign] ? card._prgDesign : 'compact';
    const show = (v, fresh) => {
      if (k){ k.stop(); const i = c.kids.indexOf(k); if (i >= 0) c.kids.splice(i, 1); }
      const kk = k = ctl(c); kk.card = c.card; kk.st = c.st;
      Object.defineProperty(kk, 'held', { get:() => c.held });
      Object.defineProperty(kk, 'seen', { get:() => c.seen });
      const mine = e => { if (e.isTrusted) kk.mine = true; };
      ['pointerdown', 'keydown', 'input', 'click'].forEach(t => kk.on(main, t, mine, true));
      kk.on(main, 'focusin', e => { if (e.isTrusted && e.timeStamp - lastInput < 100) kk.mine = true; }, true);
      if (openPop && main.contains(openPop.pop)) closePops();
      hideTip(); $$(':scope>.hand', c.st).forEach(h => h.remove());
      main.innerHTML = PRG_D[v][0];
      try { PRG_D[v][1](main, kk); } catch(e){ console.error(e); }
      if (fresh) reveal(main);
    };
    c.offs.push(() => { if (k) k.stop(); });
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === at)));
    seg(sg, v => { if (v === at || !PRG_D[v]) return; at = card._prgDesign = v; show(v, true); });
    show(at, false);
  }
  DM.def('progress', (r, c, card) => {
    // installed on its own (no switch), or inside another component, it is the classic run
    const dm = $(':scope>.prg-dm', r);
    if (!dm) return classic(r, c, card);
    if (r !== c.st || !card){ dm.replaceWith(...$(':scope>.dm-main', dm).childNodes); return classic(r, c, card); }
    prgDesigns(r, c);
  });
}
/* ---------- Slider ---------- */
DM.def('slider', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark','xs'));
  const q = s => $(`.sdx-tr[data-s="${s}"]`, r);
  /* one track: its knobs, the range they run over and how values read. Pointer: press anywhere on the track and the nearest
     knob comes to it and follows. Keys on a knob: arrows one step, Shift with an arrow or Page Up/Down ten, Home and End the
     ends. Two knobs never cross */
  function track(tr, o){
    const ks = $$('.sdx-k', tr), fill = $('.sdx-fill', tr), v = o.vals.slice();
    const pct = x => (x - o.min) / (o.max - o.min) * 100, snap = x => Math.round((x - o.min) / o.step) * o.step + o.min, fix = x => +x.toFixed(4);
    const clamp = (i, x) => { let lo = o.min, hi = o.max; if (ks.length > 1){ if (i === 0) hi = v[1] - o.step; else lo = v[0] + o.step; } return Math.max(lo, Math.min(hi, x)); };
    const paint = () => {
      ks.forEach((k, i) => { k.style.left = pct(v[i]) + '%'; $('.sdx-tt', k).textContent = o.fmt(v[i]); k.setAttribute('aria-valuemin', ks.length > 1 && i ? fix(v[0] + o.step) : o.min); k.setAttribute('aria-valuemax', ks.length > 1 && !i ? fix(v[1] - o.step) : o.max); k.setAttribute('aria-valuenow', fix(v[i])); k.setAttribute('aria-valuetext', o.text(v[i], i)); });
      fill.style.left = ks.length > 1 ? pct(v[0]) + '%' : '0'; fill.style.width = (ks.length > 1 ? pct(v[1]) - pct(v[0]) : pct(v[0])) + '%';
      o.change && o.change(v);
    };
    // a little hop when a knob snaps onto the agent's mark
    const hop = i => { if (REDUCE) return; $('.sdx-kb', ks[i]).animate([{ transform:'scale(1.2)' }, { transform:'scale(1.38)', offset:.35 }, { transform:'scale(1.2)' }], { duration:320, easing:'cubic-bezier(.34,1.56,.64,1)' }); };
    const set = (i, x, near) => { x = clamp(i, snap(x)); let hit = false; if (near != null && o.rec != null && Math.abs(x - o.rec) <= near){ hit = true; x = o.rec; } if (fix(x) === fix(v[i])) return; v[i] = fix(x); paint(); if (hit && tr.classList.contains('drag')) hop(i); };
    // a value set from outside (a stop, the recommended mark, a tick) glides there: the knob and the fill ease across while
    // the value lands at once
    let gt = 0;
    const glide = (i, x) => { say(i); tr.classList.add('glide'); clearTimeout(gt); gt = setTimeout(() => tr.classList.remove('glide'), 500); set(i, x); };
    let sayT = 0; const say = i => { ks.forEach((k, j) => k.classList.toggle('on', j === i)); ks[i].classList.add('say'); clearTimeout(sayT); sayT = setTimeout(() => ks[i].classList.remove('say'), 1200); };
    let act = 0;
    const at = e => { const b = tr.getBoundingClientRect(); return o.min + (o.max - o.min) * Math.max(0, Math.min(1, (e.clientX - b.left) / b.width)); };
    tr.addEventListener('pointerdown', e => {
      if (e.target.closest('.sdx-rec') || e.button) return;
      const x = at(e); act = ks.length > 1 ? (Math.abs(x - v[0]) <= Math.abs(x - v[1]) ? (x < v[0] ? 0 : Math.abs(x - v[0]) < Math.abs(x - v[1]) ? 0 : 1) : 1) : 0;
      tr.classList.remove('glide'); tr.setPointerCapture(e.pointerId); tr.classList.add('drag'); ks.forEach((k, j) => k.classList.toggle('on', j === act));
      ks.forEach(k => k.classList.add('ptr'));
      e.preventDefault(); ks[act].focus({ preventScroll:true, focusVisible:false }); set(act, x, (o.max - o.min) * .05);
      // it leans into the way it moves, as far as 16 degrees, and rights itself once the pointer rests
      let lx = e.clientX, lt = e.timeStamp, rest = 0; const kb = $('.sdx-kb', ks[act]);
      tr.onpointermove = ev => { set(act, at(ev), (o.max - o.min) * .05);
        if (REDUCE) return; const dt = Math.max(8, ev.timeStamp - lt), vx = (ev.clientX - lx) / dt; lx = ev.clientX; lt = ev.timeStamp;
        kb.style.setProperty('--tilt', Math.max(-16, Math.min(16, vx * 14)).toFixed(1) + 'deg'); clearTimeout(rest); rest = setTimeout(() => kb.style.setProperty('--tilt', '0deg'), 90); };
      tr.onpointerup = tr.onpointercancel = () => { tr.classList.remove('drag'); tr.onpointermove = null; clearTimeout(rest); kb.style.setProperty('--tilt', '0deg');
        // let go, it drops back with a bounce
        if (!REDUCE) kb.animate([{ transform:'scale(1.2)' }, { transform:'scale(.9)', offset:.4 }, { transform:'scale(1.05)', offset:.7 }, { transform:'scale(1)' }], { duration:480, easing:'ease-out' }); };
    });
    ks.forEach((k, i) => k.addEventListener('keydown', e => {
      k.classList.remove('ptr');
      const big = o.step * (o.big || 10), d = { ArrowRight:o.step, ArrowUp:o.step, ArrowLeft:-o.step, ArrowDown:-o.step, PageUp:big, PageDown:-big }[e.key];
      if (d != null){ e.preventDefault(); set(i, v[i] + (e.shiftKey && /Arrow/.test(e.key) ? Math.sign(d) * big : d)); say(i); }
      else if (e.key === 'Home' || e.key === 'End'){ e.preventDefault(); set(i, e.key === 'Home' ? -Infinity : Infinity); say(i); }
    }));
    paint();
    return { glide, get:() => v.slice(), knobs:ks };
  }

  /* Creativity: a temperature from 0 to 1, read as five named stops, with a sample line that rewrites itself in the tone */
  const NAMES = ['Precise', 'Focused', 'Balanced', 'Playful', 'Creative'];
  const SAMPLE = [
    'The export failed because the token expired. Renew it in Settings.',
    'The export failed: your access token expired. Renew it in Settings, then run it again.',
    "Your export didn't finish because its access token had expired. Renew it in Settings and try again.",
    'Your export tripped over an expired token. A quick renewal in Settings will get it moving.',
    'The export ran out of road when its token expired mid-trip. Renew it in Settings and send it on its way.'
  ];
  const band = x => Math.min(4, Math.round(x * 4)), sm = $('.sdx-sm span', r), stops = $$('.sdx-stops button', r), REC = .4;
  let shown = -1;
  const cr = track(q('cr'), { min:0, max:1, step:.05, big:4, vals:[.5], rec:REC, fmt:x => x.toFixed(2), text:x => `${x.toFixed(2)}, ${NAMES[band(x)]}${Math.abs(x - REC) < .001 ? ', recommended' : ''}`,
    change:([x]) => { $('.sdx-v', q('cr').parentElement).textContent = `${NAMES[band(x)]}, ${x.toFixed(2)}`; stops.forEach(b => b.setAttribute('aria-pressed', Math.abs(+b.dataset.v - x) < .001));
      const b = band(x); if (b !== shown){ shown = b; swap(sm, SAMPLE[b]); } } });
  const rec = $('.sdx-rec', r); rec.style.left = REC * 100 + '%';
  $('.sdx-rail', q('cr')).insertAdjacentHTML('beforeend', `<i class="sdx-notch" style="left:calc(10px + (100% - 20px) * ${REC})"></i>`);
  rec.onclick = () => cr.glide(0, REC);
  stops.forEach(b => b.onclick = () => cr.glide(0, +b.dataset.v));

  /* Tool calls per run: steps of 10, with a tick and a number at each step you can press */
  const T = [10, 20, 30, 40, 50], ticks = $('.sdx-ticks', r);
  ticks.innerHTML = T.map(t => `<button data-v="${t}" style="left:${(t - 10) / 40 * 100}%" aria-label="${t} tool calls"><i></i>${t}</button>`).join('');
  const mx = track(q('mx'), { min:10, max:50, step:10, big:2, vals:[30], fmt:x => x + ' calls', text:x => x + ' tool calls',
    change:([x]) => { $('.sdx-v', q('mx').parentElement).textContent = x + ' calls'; $$('button', ticks).forEach(b => b.setAttribute('aria-pressed', +b.dataset.v === x)); } });
  $$('button', ticks).forEach(b => b.onclick = () => mx.glide(0, +b.dataset.v));

  /* Cost per run: a range in dollars; its two knobs stay a step apart */
  const $f = x => '$' + x.toFixed(2);
  const co = track(q('co'), { min:0, max:1, step:.05, big:4, vals:[.1, .6], fmt:$f, text:(x, i) => (i ? 'At most ' : 'At least ') + $f(x),
    change:([a, b]) => { $('.sdx-v', q('co').parentElement).textContent = `${$f(a)} to ${$f(b)}`; } });

  // the preview's story: try the far end, take the agent's recommendation, read fewer tool calls, then narrow the budget
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.tap(stops[2]); await s.beat(4);
    await s.point(rec); await s.beat(3);
    await s.tap(rec); await s.beat(4);
    await s.tap($('button[data-v="20"]', ticks)); await s.beat(3);
    await s.point(co.knobs[1], false); await s.beat(1);
    co.glide(1, .35); await s.beat(3);
    s.away(); await s.beat(2);
  });
});
/* ---------- Carousel ---------- */
/* a draft being made builds up out of pixels on a canvas over its frame (owner, 5 Nov): first a sparse grid of cells that
   twinkle in the picture's colours, a few in the accent; then the picture as coarse blocks that refine in four steps (6×4,
   12×8, 24×16, 48×32), each step settling in its own order (scattered, a diagonal wave, out from the middle, a scan from the
   left) with a short lift as each cell lands; then the picture itself comes into focus over the last step. One that fails
   glitches, loses its colour and falls apart into its error. The colours come from the photo once one is laid on the picture
   (on designme.dev, art/art.js) and otherwise from its gradient (--art), so an install builds up in the same colours. Soft
   rounds its cells by --rk (from the frame's corner), Blueprint keeps them square on a hairline grid.
   crsPixels(canvas, { g, pic, pace, on }) returns the field: step(ms) moves it on and draws, when(u) waits for a share of the
   way (0 to 1), fail() glitches it out, still() draws the coarse mosaic once, for reduced motion. on(percent, phase) hears
   the progress. It only draws when stepped, so whoever steps it decides when it runs */
function crsPixels(cv, { g = '', pic = null, pace = 1, on = () => {} } = {}){
  const x = cv.getContext('2d'); if (!x) return null;
  const SEED = 700 * pace, LV = [[6, 4, 460], [12, 8, 520], [24, 16, 560], [48, 32, 620]].map(([c, r, d]) => ({ c, r, d:d * pace })), END = SEED + LV.reduce((a, l) => a + l.d, 0);
  let at = SEED; for (const l of LV){ l.s = at; at += l.d; }
  // a seeded random, so each picture builds up its own way
  let h = 2166136261; for (const ch of g) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rnd = () => { h = h + 0x6D2B79F5 | 0; let t = Math.imul(h ^ h >>> 15, 1 | h); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  let w = 0, ht = 0, dpr = 1, base = null, bx = null, baked = -1, t = 0, pct = -1, photo = false, looked = 0, still = false, fail = null;
  const waits = [];
  const cl = v => v < 0 ? 0 : v > 1 ? 1 : v, out3 = p => 1 - (1 - p) ** 3, back = p => 1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2;
  // a colour as CSS, lifted by k: brighter in its own hue (a dark brown lifts to a warmer brown, not to grey), and a pale one
  // only as far as its brightest channel allows, so nothing flares to white
  const rgb = (c, k = 0) => { const m = Math.min(1 + k * 1.2, 255 / Math.max(1, c[0], c[1], c[2])); return `rgb(${c.map(v => Math.round(v * m + (255 - v * m) * k * .15)).join(',')})`; };
  /* the colours, as a 48×32 grid averaged down to each step. From the gradient: its stops painted the way CSS lays them
     out, with a little grain so the blocks don't read as stripes */
  function fromGradient(){
    const m = /linear-gradient\((.*)\)\s*$/i.exec(g.trim()); if (!m) return null;
    const parts = m[1].split(/,(?![^(]*\))/).map(p => p.trim()); let ang = 180;
    if (/deg$/.test(parts[0])) ang = parseFloat(parts.shift());
    else if (/^to /.test(parts[0])) ang = { 'to top':0, 'to right':90, 'to bottom':180, 'to left':270 }[parts.shift()] ?? 180;
    const st = parts.map(p => { const k = /^(#[0-9a-f]{3,8})(?:\s+(-?[\d.]+)%)?$/i.exec(p); return k && { c:k[1], at:k[2] != null ? +k[2] / 100 : null }; });
    if (st.length < 2 || st.some(s => !s)) return null;
    if (st[0].at == null) st[0].at = 0; if (st[st.length - 1].at == null) st[st.length - 1].at = 1;
    for (let i = 1; i < st.length; i++) if (st[i].at == null){ let j = i; while (st[j].at == null) j++; for (let k = i; k < j; k++) st[k].at = st[i - 1].at + (st[j].at - st[i - 1].at) * (k - i + 1) / (j - i + 1); }
    const W = 48, H = 32, o = document.createElement('canvas'); o.width = W; o.height = H; const ox = o.getContext('2d');
    const a = ang * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), L = Math.abs(W * dx) + Math.abs(H * dy);
    const gr = ox.createLinearGradient(W / 2 - dx * L / 2, H / 2 - dy * L / 2, W / 2 + dx * L / 2, H / 2 + dy * L / 2);
    let last = 0; for (const s of st){ last = Math.max(last, cl(s.at)); gr.addColorStop(last, s.c); }
    ox.fillStyle = gr; ox.fillRect(0, 0, W, H);
    const d = ox.getImageData(0, 0, W, H).data, px = [];
    for (let i = 0; i < W * H; i++){ const k = .93 + rnd() * .1 + .04 * Math.sin(i % W * .5 + (i / W | 0) * .9); px.push([d[i * 4] * k, d[i * 4 + 1] * k, d[i * 4 + 2] * k].map(v => Math.min(255, v))); }
    return px;
  }
  // from the photo: covering the frame as the picture does, 96×64 averaged to 48×32
  function fromImage(im){
    const W = 96, H = 64, o = document.createElement('canvas'); o.width = W; o.height = H; const ox = o.getContext('2d');
    const fr = (cv.clientWidth / cv.clientHeight) || 1.5, ir = im.naturalWidth / im.naturalHeight;
    let sw = im.naturalWidth, sh = im.naturalHeight; if (ir > fr) sw = sh * fr; else sh = sw / fr;
    ox.imageSmoothingQuality = 'high'; ox.drawImage(im, (im.naturalWidth - sw) / 2, (im.naturalHeight - sh) / 2, sw, sh, 0, 0, W, H);
    let d; try { d = ox.getImageData(0, 0, W, H).data; } catch(e){ return null; }
    const px = [];
    for (let j = 0; j < 32; j++) for (let i = 0; i < 48; i++){ const c = [0, 0, 0]; for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]){ const k = ((j * 2 + b) * W + i * 2 + a) * 4; c[0] += d[k]; c[1] += d[k + 1]; c[2] += d[k + 2]; } px.push(c.map(v => v / 4)); }
    return px;
  }
  const grey = [150, 150, 150];
  function palette(px){
    if (!px) px = Array.from({ length:48 * 32 }, () => grey);
    LV.forEach(l => {
      const f = 48 / l.c; l.col = [];
      for (let j = 0; j < l.r; j++) for (let i = 0; i < l.c; i++){ const c = [0, 0, 0]; for (let b = 0; b < f; b++) for (let a = 0; a < f; a++){ const p = px[(j * f + b) * 48 + i * f + a]; c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; } l.col.push(c.map(v => v / f / f)); }
      l.css = l.col.map(c => rgb(c));
    });
    base = null;
  }
  /* each step's order: when each cell starts to land, from 0 to 1 */
  const ORD = [() => rnd(), (i, j, l) => (i / l.c + j / l.r) / 2, (i, j, l) => Math.hypot((i + .5) / l.c - .5, ((j + .5) / l.r - .5) * .67) / .6, (i, j, l) => i / l.c];
  LV.forEach((l, k) => { const o = []; for (let j = 0; j < l.r; j++) for (let i = 0; i < l.c; i++) o.push(cl(ORD[k](i, j, l) * .82 + rnd() * .18)); l.o = o; l.par = o.map((_, n) => k ? ((n / l.c | 0) >> 1) * LV[k - 1].c + ((n % l.c) >> 1) : -1); });
  // the sparse field before the blocks: a 24×16 grid, each cell twinkling at its own rate, one in twenty in the accent
  const TW = Array.from({ length:24 * 16 }, () => ({ ph:rnd() * 6.28, w:2.6 + rnd() * 3.4, ac:rnd() < .05 }));
  palette(fromGradient());

  // the look: corners from the frame's own (Soft scales them by --rk, Blueprint has none) and the theme's colours, read once
  const fig = cv.closest('figure') || cv.parentElement, R = parseFloat(getComputedStyle(fig).borderTopLeftRadius) || 0, cs = getComputedStyle(cv);
  const ACC = cs.getPropertyValue('--accent').trim() || '#888', BAD = cs.getPropertyValue('--bad').trim() || '#c33', LINE = cs.getPropertyValue('--line').trim() || 'rgba(128,128,128,.3)';
  const geo = l => { const cw = w / l.c, ch = ht / l.r, gp = R ? Math.min(2.5, Math.max(1, cw * .07)) : 1, r = R ? Math.min(cw * .14, R * .3) : 0; return { cw, ch, gp, r }; };
  const snap = v => Math.round(v * dpr) / dpr;
  // a cell's slot (its share of the frame, gutter included) and the cell drawn in it, scaled about its middle
  const slot = (l, n, G) => { const i = n % l.c, j = n / l.c | 0, X = snap(i * G.cw), Y = snap(j * G.ch); return [X, Y, snap((i + 1) * G.cw) - X, snap((j + 1) * G.ch) - Y]; };
  const box = (c, l, n, G, s = 1) => { const [X0, Y0, W0, H0] = slot(l, n, G), cw = (W0 - G.gp) * s, ch = (H0 - G.gp) * s, X = X0 + (W0 - cw) / 2, Y = Y0 + (H0 - ch) / 2;
    if (G.r * s >= 1.2 && c.roundRect){ c.beginPath(); c.roundRect(X, Y, cw, ch, G.r * s); c.fill(); } else c.fillRect(X, Y, cw, ch); };
  function fit(){
    const cw = cv.clientWidth, ch = cv.clientHeight; if (!cw || !ch) return false;
    const d = Math.min(2, devicePixelRatio || 1);
    if (cw !== w || ch !== ht || d !== dpr){ w = cw; ht = ch; dpr = d; cv.width = Math.round(w * dpr); cv.height = Math.round(ht * dpr); base = null; }
    return true;
  }
  // the steps that have landed are kept on a second canvas, and each cell of the step landing now is painted onto it as it lands
  function bake(k){
    if (base && baked === k - 1) return;
    if (!base){ base = document.createElement('canvas'); bx = base.getContext('2d'); }
    base.width = cv.width; base.height = cv.height; bx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let q = 0; q < k; q++){ const l = LV[q], G = geo(l); for (let n = 0; n < l.css.length; n++){ bx.clearRect(...slot(l, n, G)); bx.fillStyle = l.css[n]; box(bx, l, n, G); } }
    baked = k - 1; LV[k].done = new Uint8Array(LV[k].c * LV[k].r);
  }
  function frame(){
    x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, ht);
    let k = LV.findIndex(l => t < l.s + l.d); if (k < 0) k = LV.length;
    // the twinkling field, thicker as it goes on, fading out as the first blocks land
    const fade = k === 0 ? cl(1 - (t - LV[0].s) / LV[0].d * 1.4) : 0;
    if (t < LV[0].s + LV[0].d && fade > 0){
      const dens = .08 + .5 * cl(t / SEED), l = { c:24, r:16 }, G = geo(l), s = t / 1000;
      if (!R){ x.globalAlpha = .5 * cl(t / 300) * fade; x.fillStyle = LINE; for (let i = 1; i < 24; i++) x.fillRect(snap(i * G.cw), 0, 1 / dpr, ht); for (let j = 1; j < 16; j++) x.fillRect(0, snap(j * G.ch), w, 1 / dpr); }
      for (let n = 0; n < TW.length; n++){
        const c = TW[n], a = cl((.5 + .5 * Math.sin(s * c.w + c.ph) - (1 - dens)) / dens); if (a < .03) continue;
        x.globalAlpha = cl(a * 2.5) * fade; x.fillStyle = c.ac ? ACC : LV[2].css[n]; box(x, l, n, G, .3 + .6 * a);
      }
      x.globalAlpha = 1;
    }
    if (k > 0 || t >= LV[0].s){
      const kk = Math.min(k, LV.length - 1);
      bake(kk); const l = LV[kk], G = geo(l), lt = (t - l.s) / l.d;
      // the cells of this step that have landed go onto the kept canvas; the ones landing now are drawn over it
      for (let n = 0; n < l.o.length; n++){ if (l.done[n] || cl((lt - l.o[n] * .72) / .28) < 1) continue; l.done[n] = 1; bx.clearRect(...slot(l, n, G)); bx.fillStyle = l.css[n]; box(bx, l, n, G); }
      x.drawImage(base, 0, 0, w, ht);
      if (k < LV.length) for (let n = 0; n < l.o.length; n++){
        if (l.done[n]) continue; const p = cl((lt - l.o[n] * .72) / .28); if (p <= 0) continue;
        const e = out3(p), lift = Math.sin(Math.PI * p) * .32, c = kk ? LV[kk - 1].col[l.par[n]] : null, own = l.col[n];
        const mix = c ? [0, 1, 2].map(q => c[q] + (own[q] - c[q]) * e) : own;
        if (kk) x.clearRect(...slot(l, n, G)); else x.globalAlpha = cl(p * 5);
        x.fillStyle = rgb(mix, lift); box(x, l, n, G, kk ? 1 : .35 + .65 * back(p)); x.globalAlpha = 1;
      }
      // all four steps in and the picture not here yet: a cell here and there lifts and settles while it finishes
      if (k >= LV.length && t > END + 250){ const l3 = LV[3], G3 = geo(l3), s = (t - END - 250) / 1000; for (let n = 0; n < l3.col.length; n += 7){ const a = Math.sin(s * 2.1 + TW[n % TW.length].ph * 3); if (a < .9) continue; x.fillStyle = rgb(l3.col[n], (a - .9) * 3); box(x, l3, n, G3); } }
    }
  }
  /* failing: the picture so far is kept, shaken in bands as it loses its colour, a few cells flash in the error colour, then
     it falls apart cell by cell */
  function glitch(){
    const q = fail.t / 520, dz = (fail.t - 520) / 460, W = cv.width, H = cv.height, bh = H / 16, cw = W / 24;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
    if (q < 1){
      if (fail.t - fail.roll > 60){ fail.roll = fail.t; fail.dx = fail.dx.map(() => rnd() < .15 + .5 * q ? Math.round((rnd() - .5) * 6) * cw : 0); fail.hot = Array.from({ length:3 + (rnd() * 4 | 0) }, () => [rnd() * 24 | 0, rnd() * 16 | 0]); }
      for (let j = 0; j < 16; j++){ x.drawImage(fail.snap, 0, j * bh, W, bh, fail.dx[j], j * bh, W, bh); x.globalAlpha = cl(q * 1.3); x.drawImage(fail.grey, 0, j * bh, W, bh, fail.dx[j], j * bh, W, bh); x.globalAlpha = 1; }
      x.fillStyle = BAD; x.globalAlpha = .9 * cl(q * 2); for (const [i, j] of fail.hot) x.fillRect(i * cw + 1, j * bh + 1, cw - 2, bh - 2); x.globalAlpha = 1;
    } else for (let n = 0; n < 24 * 16; n++){
      const p = cl((dz - fail.o[n] * .6) / .4), s = 1 - out3(p); if (s <= 0) continue;
      const i = n % 24, j = n / 24 | 0; x.globalAlpha = s; x.drawImage(fail.grey, i * cw, j * bh, cw, bh, i * cw + cw * (1 - s) / 2, j * bh + bh * (1 - s) / 2, cw * s, bh * s);
    }
    x.globalAlpha = 1;
  }
  function look(){
    // the photo, once one is laid on the picture: it is used if it loads before the first blocks land
    if (photo || !pic || t >= LV[0].s) return;
    const u = /url\(["']?([^"')]+)["']?\)/.exec(pic.style.backgroundImage || ''); if (!u) return;
    photo = true; const im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = () => { if (t >= LV[0].s && !still) return; const px = fromImage(im); if (px){ palette(px); if (still) api.still(); } };
    im.src = u[1];
  }
  const api = {
    get u(){ return cl(t / END); },
    step(dt){
      if (fail){ fail.t += dt; if (fit()) glitch(); if (fail.t >= 980 && fail.res){ fail.res(); fail.res = null; } return; }
      t += dt; if (looked++ % 6 === 0) look();
      if (fit()) frame();
      const u = cl(t / END), p = Math.min(99, Math.floor(u * 100));
      if (p !== pct){ pct = p; on(p, t < SEED ? 'Sketching' : t < LV[2].s ? 'Blocking in' : t < END ? 'Refining' : 'Finishing'); }
      for (let i = waits.length - 1; i >= 0; i--) if (u >= waits[i].u){ waits[i].res(); waits.splice(i, 1); }
    },
    when:u => new Promise(res => waits.push({ u, res })),
    fail(){
      if (fail) return fail.p; fit();
      const snapC = document.createElement('canvas'); snapC.width = cv.width; snapC.height = cv.height; snapC.getContext('2d').drawImage(cv, 0, 0);
      const gr = document.createElement('canvas'); gr.width = cv.width; gr.height = cv.height; const gx = gr.getContext('2d'); gx.drawImage(cv, 0, 0); gx.globalCompositeOperation = 'saturation'; gx.fillStyle = '#808080'; gx.fillRect(0, 0, gr.width, gr.height); gx.globalCompositeOperation = 'destination-in'; gx.drawImage(cv, 0, 0);
      fail = { t:0, roll:-1e9, dx:Array(16).fill(0), hot:[], snap:snapC, grey:gr, o:Array.from({ length:24 * 16 }, () => rnd()) };
      fail.p = new Promise(res => { fail.res = res; });
      return fail.p;
    },
    // reduced motion: the 12×8 mosaic, drawn once (and again if the photo arrives)
    still(){
      still = true; look(); if (!fit()) return;
      const l = LV[1], G = geo(l); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, ht);
      for (let n = 0; n < l.css.length; n++){ x.fillStyle = l.css[n]; box(x, l, n, G); }
    }
  };
  look();
  return api;
}
DM.def('carousel', (r, c, card) => {
  r.innerHTML = r.innerHTML.replace(/\{chev-l\}/g, I('chev-l')).replace(/\{chev-r\}/g, I('chev-r'));
  const sg = $('.demo .seg2', r), box = { variants:$('.crs-c[data-type="variants"]', r), images:$('.crs-c[data-type="images"]', r) };
  // the pictures: each has words for a screen reader and g, a gradient of its colours that stands in for it. On designme.dev,
  // art/art.js lays the photo of the same name over it: photos from Pexels, free under the Pexels License
  // (https://www.pexels.com/license/), credited in art/README.md and never part of an install

  /* Variants: four drafts of one cover image, "mountains at golden hour": what each looks like, how long it took and p, how
     long it takes to build up here (1 is about three seconds). The last one fails once */
  const V = [
    { l:'Variant A', d:'Amber haze', t:'9s', p:1, art:'cover-a', g:'linear-gradient(#ffb35c,#d9733a 45%,#3a2116 70%)', alt:'Forested ridges in silhouette under an amber sky' },
    { l:'Variant B', d:'Alpenglow', t:'11s', p:1.2, art:'cover-b', g:'linear-gradient(#a9bccb,#e08a5c 50%,#3a2f2a 75%)', alt:'Rocky peaks lit pink by the low sun under a pale sky' },
    { l:'Variant C', d:'Lake at dusk', t:'7s', p:.85, art:'cover-c', g:'linear-gradient(#e6b46a,#b88650 50%,#1f1810 80%)', alt:'Mountains round a lake in a golden haze, dark firs in front' },
    { l:'Variant D', d:'Valley light', t:'14s', p:1.1, art:'cover-d', g:'linear-gradient(#c9b88f,#5f8f86 45%,#2f5a3a)', alt:'Sun rays over a green valley with a winding road, mountains all round', fail:1 }
  ];
  const vb = box.variants, vtr = $('.crs-tr', vb), sub = $('.crs-sub', vb), vsr = $('.crs-sr', vb);
  const st = V.map(() => 'wait'); let kept = -1, started = false;
  vtr.innerHTML = V.map((v, i) => `<div class="crs-s" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${V.length}"><figure class="crs-fig"><div class="crs-pv"></div><figcaption class="crs-f"><div><b>${v.l}</b><span class="muted"></span></div><span class="crs-x"></span></figcaption></figure></div>`).join('');
  const S = $$('.crs-s', vtr);
  const say = t => { vsr.textContent = t; };
  // the picture waits in its frame from the start, unseen, so the pixels can take its colours (and on designme.dev the photo)
  const pre = v => `<span class="crs-img pre" data-pic="${v.art}" style="--art:${v.g}"></span>`;
  function draw(i){
    const v = V[i], s = S[i], pv = $('.crs-pv', s), meta = $('.crs-f .muted', s), x = $('.crs-x', s), k = st[i];
    pv.className = 'crs-pv' + (k === 'fail' ? ' fail' : '');
    pv.classList.toggle('gen', k === 'gen');
    const img = $('.crs-img', pv);
    if (k === 'wait' || k === 'gen'){
      if (!img || !img.classList.contains('pre')) pv.innerHTML = I('image', 'ph') + pre(v);
      if (k === 'gen' && !$('.crs-px', pv)) $('.crs-img', pv).insertAdjacentHTML('beforebegin', '<canvas class="crs-px" aria-hidden="true"></canvas>');
      meta.textContent = k === 'gen' ? 'Making' : 'Waiting'; x.innerHTML = k === 'gen' ? '<span class="tag"><span class="spin"></span>Making</span>' : '<span class="tag">Queued</span>';
    }
    else if (k === 'fail'){ pv.innerHTML = `${I('alert')}<b>Couldn't make this picture</b><span class="muted">The image model timed out</span><button class="pill line sm crs-retry">${I('refresh','xs')}Retry</button>`; meta.textContent = v.d; x.innerHTML = '<span class="tag bad">Failed</span>'; $('.crs-retry', pv).onclick = () => retry(i); }
    else {
      // the picture comes into focus over the last of the pixels, which go once it is in
      if (img && img.classList.contains('pre')){
        img.classList.remove('pre'); img.setAttribute('role', 'img'); img.setAttribute('aria-label', v.alt);
        const ph = $('.ph', pv); if (ph) ph.remove();
        const px = $('.crs-px', pv); if (px){ const rm = () => px.remove(); img.addEventListener('animationend', rm, { once:true }); c.later(1500, rm); }
      } else if (!img) pv.innerHTML = `<span class="crs-img" role="img" aria-label="${v.alt}" data-pic="${v.art}" style="--art:${v.g}"></span>`;
      meta.textContent = `${v.d} · ${v.t}`; x.innerHTML = `<button class="pill line sm crs-keep" aria-pressed="${kept === i}">${kept === i ? I('check','xs') + 'Kept' : 'Keep'}</button>`; $('.crs-keep', x).onclick = () => keep(i);
    }
  }
  function keep(i){ if (st[i] !== 'ready') return; kept = kept === i ? -1 : i; vb.classList.toggle('kept', kept >= 0); S.forEach((s, j) => { s.classList.toggle('kept', j === kept); if (st[j] === 'ready') draw(j); }); swap(sub, kept >= 0 ? `Keeping ${V[kept].l}` : head()); say(kept >= 0 ? `Kept ${V[i].l}` : `${V[i].l} no longer kept`); }
  const head = () => { const done = st.filter(x => x === 'ready').length, bad = st.filter(x => x === 'fail').length, busy = st.some(x => x === 'wait' || x === 'gen'); return busy ? `Making ${V.length} variants, ${done} ready` : `${done} ready${bad ? `, ${bad} failed` : ''}`; };
  // a swipe, a drag, the arrows, the dots and the keys all move the one track; Enter on it keeps the draft in view
  const vk = carousel(c, vtr, { prev:$('.crs-prev', vb), next:$('.crs-next', vb), dots:$('.crs-dots', vb), dot:i => `Go to ${V[i].l}`, say:i => say(`${V[i].l}, ${i + 1} of ${V.length}`),
    key:e => { if (e.key === 'Enter'){ e.preventDefault(); keep(vk.stop.i); } } });
  /* the drafts being built share one frame loop. It runs only while one is building, the carousel is on screen or near it,
     the tab is open and no pointer holds the demo; otherwise it rests, looking again four times a second. Time only moves
     while it runs, so a held draft picks up where it was */
  const live = new Set(); let raf = 0, nap = 0, last = 0;
  const wake = () => { if (!raf && !nap && !c.dead && live.size) raf = requestAnimationFrame(tick); };
  const tick = t => {
    raf = 0; if (c.dead || !live.size){ last = 0; return; }
    if (c.seen === false || c.hold() || document.hidden){ last = 0; nap = setTimeout(() => { nap = 0; wake(); }, 250); return; }
    const dt = last ? Math.min(64, t - last) : 16; last = t;
    live.forEach(f => f.step(dt)); wake();
  };
  c.offs.push(() => { cancelAnimationFrame(raf); clearTimeout(nap); });
  // the agent makes all four at once, each at its own pace, once the drafts are first shown. Each builds up out of pixels and
  // comes into focus where its placeholder stood; the one that fails glitches out halfway. With reduced motion the frame
  // shows a still mosaic of the picture's colours until it lands
  async function make(i){
    const v = V[i], s = S[i], meta = $('.crs-f .muted', s);
    st[i] = 'gen'; draw(i); swap(sub, head());
    const f = crsPixels($('.crs-px', s), { g:v.g, pic:$('.crs-img', s), pace:v.p, on:(p, ph) => { if (st[i] === 'gen') meta.textContent = `${ph} · ${p}%`; } });
    const bad = v.fail === 1;
    if (!f || REDUCE){ if (f) f.still(); await new Promise(res => c.later(bad ? 1400 : 1800 * v.p, res)); }
    else { live.add(f); wake(); await f.when(bad ? .5 : 1); if (bad) await f.fail(); live.delete(f); }
    if (bad){ v.fail = 2; st[i] = 'fail'; draw(i); say(`${v.l} failed`); } else { st[i] = 'ready'; draw(i); say(`${v.l} ready`); }
    if (kept < 0) swap(sub, head());
  }
  function retry(i){ c.run(async () => { await make(i); }); }
  const startV = () => { if (started) return; started = true; V.forEach((v, i) => c.run(async () => { await c.wait(500 + i * 350); await make(i); })); };
  V.forEach((v, i) => draw(i));

  /* Images: six photos, each with a title and the colours in it */
  const P = [
    { art:'spiral-staircase', t:'Spiral staircase', m:'Bronze, cream and slate', g:'linear-gradient(135deg,#8a5a32,#d9a46a 50%,#5f6670)', alt:'Looking down a spiral staircase that coils in rings of bronze and cream' },
    { art:'minaret-sunset', t:'Minaret at sunset', m:'Sand, ochre and haze', g:'linear-gradient(#cfc6bd,#d59a52 45%,#7a4f2c)', alt:'A stone minaret above a plain of golden fields at sunset' },
    { art:'cat-apple-tree', t:'Cat in the apple tree', m:'Sky blue, leaf green and ginger', g:'linear-gradient(135deg,#3f8fe0,#7fb84a 50%,#e6a35a)', alt:'A ginger and white cat in an apple tree, reaching a paw toward an apple' },
    { art:'snowboarder', t:'Fresh snow', m:'Snow white, sky blue and black', g:'linear-gradient(#2f6fd6,#e8eef5 45%,#c9d3dd)', alt:'A snowboarder in a white jacket and blue goggles raising a hand among frosted trees' },
    { art:'shah-i-zinda', t:'Shah-i-Zinda', m:'Turquoise, sand and red', g:'linear-gradient(135deg,#1f8c9a,#d8b48a 50%,#b02a2a)', alt:'A woman in a red dress walking down a lane of turquoise-tiled tombs in Samarkand' },
    { art:'beach-signpost', t:'Beach signpost', m:'Turquoise, coral and peach', g:'linear-gradient(#5aa9e6,#2cc3c9 50%,#f2b08a)', alt:'A painted wooden signpost on a sandy cliff above a turquoise sea' }
  ];
  const ib = box.images, itr = $('.crs-tr', ib), isr = $('.crs-sr', ib);
  itr.innerHTML = P.map((p, i) => `<div class="crs-s" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${P.length}"><figure class="crs-fig"><div class="crs-pic" role="img" aria-label="${p.alt}" data-pic="${p.art}" style="--art:${p.g}"></div><figcaption class="crs-cap"><b>${p.t}</b><span class="muted">${p.m}</span></figcaption></figure></div>`).join('');
  carousel(c, itr, { prev:$('.crs-prev', ib), next:$('.crs-next', ib), dots:$('.crs-dots', ib), dot:i => `Show ${P[i].t}`, say:i => { isr.textContent = `${P[i].t}, ${i + 1} of ${P.length}`; } });

  /* the switch: Variants or Images. The pick stays with the card, so the demo playing again or Replay keeps it */
  const keepIn = card || {};
  let type = keepIn._crsType === 'images' ? 'images' : 'variants';
  $$('button', sg).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === type));
  const show = (t, fade) => {
    Object.entries(box).forEach(([k, el]) => { el.hidden = k !== t; });
    if (fade && !REDUCE && box[t].animate) box[t].animate([{ opacity:0 }, { opacity:1 }], { duration:260, easing:'ease-out' });
    if (t === 'variants') startV();
  };
  show(type);
  seg(sg, v => { if (v === type) return; type = keepIn._crsType = v; show(v, true); });

  // the preview's story, for the type on show. Variants: once the four are in, flip to the third and keep it. Images: the
  // next two pictures, the last one from the dots, then back one. A switch to the other type ends it, and the next play is
  // the other type's
  if (r === c.st) c.story(async s => {
    const t0 = type, on = () => type === t0, b = box[t0];
    const step = async (el, n) => { if (!on()) throw 'switched'; await s.tap(el); s.away(); await s.beat(n); };
    try {
      if (t0 === 'variants'){
        await s.until(() => !on() || st.every(x => x === 'ready' || x === 'fail')); if (!on()) return; await s.beat(3);
        await step($('.crs-next', b), 2); await step($('.crs-next', b), 2);
        await step($('.crs-keep', S[2]), 5);
      } else {
        await s.beat(4);
        await step($('.crs-next', b), 4); await step($('.crs-next', b), 4);
        await step($$('.crs-dots button', b).pop(), 4); await step($('.crs-prev', b), 4);
      }
    } catch(e){ if (e !== 'switched') throw e; }
  });
});