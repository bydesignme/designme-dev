TPLS["workspace-rail"] = "<div class=\"wrx panel\">\n  <nav class=\"wrx-rail\" aria-label=\"Workspace\">\n    <div class=\"wrx-ws\"><span class=\"wrx-lg\"><svg viewBox=\"-20 -83 799 799\" aria-hidden=\"true\" class=\"logo\"><path d=\"M149.497 283.784C149.477 284.047 149.474 284.311 149.487 284.575C156.385 340.034 183.548 391.116 225.9 428.196C267.989 465.044 322.188 485.532 378.414 485.855L379.743 485.859C436.453 485.868 491.188 465.353 533.619 428.212C575.912 391.194 603.062 340.216 610.018 284.856L610.018 281.512C610.008 277.337 608.324 273.315 605.303 270.335C602.277 267.351 598.155 265.656 593.837 265.656L165.647 265.656C161.338 265.656 157.226 267.349 154.21 270.331C151.198 273.309 149.524 277.326 149.523 281.491L149.523 283.437L149.497 283.784ZM114.378 247.395C118.396 247.391 122.254 245.919 125.214 243.29C128.063 240.759 129.887 237.33 130.396 233.629L130.396 233.35L130.437 232.917C136.355 171.634 165.162 114.754 211.202 73.3687C257.239 31.9859 317.206 9.06063 379.393 9.04448L379.396 9.04448C441.593 9.04583 501.574 31.964 547.624 73.3482C593.677 114.735 622.491 171.624 628.411 232.917L628.453 233.35L628.453 233.643C628.953 237.344 630.773 240.774 633.621 243.304C636.58 245.932 640.437 247.399 644.452 247.395L725.644 247.395C728.882 247.404 732.089 248.06 735.071 249.329C738.055 250.598 740.753 252.453 743.001 254.787C745.252 257.123 747.005 259.891 748.151 262.924C749.296 265.954 749.81 269.183 749.662 272.418L749.663 272.418C745.484 366.797 704.617 455.919 635.615 521.211C566.616 586.499 474.809 622.924 379.338 622.924C283.872 622.924 192.071 586.496 123.081 521.206C54.0935 455.917 13.2412 366.804 9.07133 272.438L9.07036 272.438L9.07036 272.436C9.07007 272.43 9.06967 272.423 9.06938 272.417L9.07036 272.417C8.92272 269.182 9.43655 265.953 10.5811 262.924C11.7276 259.89 13.481 257.123 15.7315 254.787C17.9805 252.452 20.6797 250.597 23.6622 249.329C26.6443 248.06 29.8504 247.404 33.0889 247.395L114.378 247.395Z\" fill=\"currentColor\" /></svg></span><span class=\"wrx-lb\"><b>DesignMe</b><span class=\"muted\">Studio</span></span></div>\n    <div class=\"wrx-nav\"><span class=\"wrx-ind\"></span></div>\n    <div class=\"wrx-sp\"></div>\n    <div class=\"wrx-runs\"><span class=\"wrx-lbh\">Running</span></div>\n    <button class=\"wrx-i wrx-pin\" aria-label=\"Pin sidebar\" data-tip=\"Pin open\" data-tip-k=\"⌘B\">{panel}<span class=\"wrx-lb\">Collapse</span></button>\n  </nav>\n  <div class=\"wrx-main\"><div class=\"wrx-mh\"></div><div class=\"wrx-sk\"><i style=\"width:70%\"></i><i style=\"width:92%\"></i><i style=\"width:56%\"></i><i class=\"b\"></i></div></div>\n</div>";
TPLS["file-explorer"] = "<div class=\"fxp panel\" data-reveal=\"flat\">\n  <div class=\"fxp-h\"><div class=\"fxp-s\">{search}<input placeholder=\"Filter files\" aria-label=\"Filter files\" spellcheck=\"false\"></div><button class=\"ib fxp-ch\" aria-label=\"Only changed\" data-tip=\"Only changed files\">{filter}</button></div>\n  <div class=\"fxp-tree\" role=\"tree\"></div>\n  <div class=\"fxp-f muted\"><span class=\"fxp-st\"></span></div>\n</div>";
TPLS["scheduled-runs"] = "<div class=\"shx panel\" data-reveal=\"flat\">\n  <div class=\"shx-h\"><div><b>Scheduled runs</b><span class=\"muted shx-st\" aria-live=\"polite\"></span></div></div>\n  <div class=\"shx-list\" role=\"list\" aria-label=\"Schedules\"></div>\n  <button class=\"shx-add\" data-pop=\".shx-pop\" data-pop-pos=\"up\" aria-haspopup=\"dialog\" aria-expanded=\"false\">{plus}New schedule</button>\n  <div class=\"pop shx-pop\" role=\"dialog\" aria-label=\"New schedule\"><form class=\"shx-f\">\n    <h4>New schedule</h4>\n    <input class=\"shx-in\" placeholder=\"What should the agent do?\" aria-label=\"What should the agent do?\" spellcheck=\"false\" autocomplete=\"off\">\n    <div class=\"seg2 shx-rep\" role=\"group\" aria-label=\"Repeat\"><button type=\"button\" aria-pressed=\"true\" data-v=\"day\">Every day</button><button type=\"button\" aria-pressed=\"false\" data-v=\"mon\">Every Monday</button><button type=\"button\" aria-pressed=\"false\" data-v=\"custom\">Custom</button></div>\n    <div class=\"shx-days\" role=\"group\" aria-label=\"Days\" hidden></div>\n    <div class=\"shx-ff\"><span class=\"muted shx-sum\"></span><button class=\"pill accent sm shx-mk\" type=\"submit\" disabled>Create</button></div>\n  </form></div>\n</div>";
TPLS["knowledge-sources"] = "<div class=\"ksx panel\" data-reveal=\"flat\">\n  <div class=\"ksx-h\"><div><b>Knowledge sources</b><span class=\"muted ksx-st\" aria-live=\"polite\"></span></div></div>\n  <div class=\"ksx-list\" role=\"list\" aria-label=\"Sources\"></div>\n  <button class=\"ksx-add\" data-pop=\".ksx-pop\" data-pop-pos=\"up\" aria-haspopup=\"menu\" aria-expanded=\"false\">{plus}Add source</button>\n  <div class=\"pop ksx-pop\" role=\"menu\" aria-label=\"Add source\"></div>\n  <div class=\"pop ksx-mpop\" role=\"menu\" aria-label=\"Source actions\"><button class=\"mi ksx-rs\" role=\"menuitem\" data-close>{refresh}Re-sync</button><div class=\"sep\"></div><button class=\"mi del ksx-rm\" role=\"menuitem\" data-close>{trash}Remove</button></div>\n  <input class=\"ksx-file\" type=\"file\" multiple hidden>\n</div>";
TPLS["tool-connections"] = "<div class=\"hnx panel\" data-reveal=\"flat\">\n  <div class=\"hnx-h\"><div><b>Tools and connections</b><span class=\"muted hnx-st\">5 connected</span></div><button class=\"pill ghost sm hnx-test\">{refresh}Test all</button></div>\n  <div class=\"hnx-list\"></div>\n  <button class=\"hnx-add\" data-pop=\".hnx-pop\" data-pop-pos=\"up\">{plus}Connect a tool</button>\n  <div class=\"pop hnx-pop\" role=\"menu\"></div>\n</div>";
TPLS["agent-settings"] = "<div class=\"dm asx-dm\" data-designs=\"card\"><div class=\"dm-main\">\n<div class=\"asx panel\">\n  <div class=\"asx-r asx-col\"><div class=\"asx-l\"><b>Autonomy</b><span class=\"muted asx-ad\">Asks before edits to shared files</span></div>\n    <div class=\"asx-steps\" role=\"radiogroup\" aria-label=\"Autonomy\"><span class=\"asx-knob\"></span><button role=\"radio\" data-v=\"0\">Ask</button><button role=\"radio\" data-v=\"1\" aria-checked=\"true\">Balanced</button><button role=\"radio\" data-v=\"2\">Autopilot</button></div></div>\n  <div class=\"asx-r\"><div class=\"asx-l\"><b>Use team memory</b><span class=\"muted\">Brand rules and past decisions</span></div><button class=\"toggle\" role=\"switch\" aria-checked=\"true\" aria-label=\"Use team memory\"></button></div>\n  <div class=\"asx-r\"><div class=\"asx-l\"><b>Post a summary in Slack</b><span class=\"muted\">#design, after each run</span></div><button class=\"toggle\" role=\"switch\" aria-checked=\"false\" aria-label=\"Post a summary in Slack\"></button></div>\n  <div class=\"asx-r\"><div class=\"asx-l\"><b>Spend cap per run</b><span class=\"muted\">Pauses and asks when reached</span></div><div class=\"asx-cap\"><button class=\"ib fill asx-m\" aria-label=\"Lower cap\">{minus}</button><span class=\"num asx-v\">$5</span><button class=\"ib fill asx-p\" aria-label=\"Raise cap\">{plus}</button></div></div>\n  <div class=\"asx-r asx-col\"><div class=\"asx-l\"><b>Instructions</b></div><textarea class=\"asx-ta\" rows=\"2\" spellcheck=\"false\">Use our tokens only. Keep copy short and friendly.</textarea></div>\n  <div class=\"asx-bar\"><span>Unsaved changes</span><button class=\"pill ghost sm asx-rs\">Reset</button><button class=\"pill accent sm asx-sv\">Save</button></div>\n</div>\n</div>\n<div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Agent settings design\"><button aria-pressed=\"true\" data-v=\"classic\">Classic</button><button aria-pressed=\"false\" data-v=\"preview\">Live preview</button><button aria-pressed=\"false\" data-v=\"tabs\">Tabs</button><button aria-pressed=\"false\" data-v=\"presets\">Presets</button></div></div>\n</div>";
TPLS["agent-builder"] = "<div class=\"abx panel\"><div class=\"abx-g\">\n  <div class=\"abx-f\">\n    <div class=\"abx-ask\"><label class=\"abx-l\" for=\"abx-desc\">Describe your agent</label><div class=\"abx-askr\"><input class=\"abx-in\" id=\"abx-desc\" autocomplete=\"off\" placeholder=\"What should it do?\"><button class=\"pill primary sm abx-go\">{spark}Draft</button></div></div>\n    <div class=\"abx-s\" data-s=\"id\" role=\"group\" aria-label=\"Identity\"><div class=\"abx-sh\"><span>Identity</span></div>\n      <div class=\"abx-idr\"><span class=\"abx-av\"></span><input class=\"abx-in abx-name\" aria-label=\"Name\" placeholder=\"Name\" autocomplete=\"off\">\n        <div class=\"abx-look\"><div class=\"abx-sw\" role=\"radiogroup\" aria-label=\"Colour\"></div><div class=\"seg2 abx-shp\" role=\"radiogroup\" aria-label=\"Shape\"></div></div></div>\n      <span class=\"abx-err\" hidden>{alert}Give it a name to save it</span>\n      <input class=\"abx-in abx-purp\" aria-label=\"Purpose\" placeholder=\"What it is for\" autocomplete=\"off\">\n    </div>\n    <div class=\"abx-s\" data-s=\"ins\" role=\"group\" aria-label=\"Instructions\"><div class=\"abx-sh\"><span>Instructions</span></div><textarea class=\"abx-ta\" rows=\"3\" aria-label=\"Instructions\" placeholder=\"How it should work\"></textarea></div>\n    <div class=\"abx-s\" data-s=\"model\" role=\"group\" aria-label=\"Model and effort\"><div class=\"abx-sh\"><span>Model and effort</span></div>\n      <div class=\"abx-mr\"><select class=\"abx-in abx-sel\" aria-label=\"Model\"><option>Haiku 5</option><option>Sonnet 5</option><option>Opus 5.5</option></select><div class=\"seg2 abx-eff\" role=\"group\" aria-label=\"Effort\"><button aria-pressed=\"false\" data-v=\"low\">Low</button><button aria-pressed=\"true\" data-v=\"med\">Medium</button><button aria-pressed=\"false\" data-v=\"high\">High</button></div></div>\n    </div>\n    <div class=\"abx-s\" data-s=\"tools\" role=\"group\" aria-label=\"Tools\"><div class=\"abx-sh\"><span>Tools</span><span class=\"muted\">What it may do in each</span></div><div class=\"abx-tools\"></div></div>\n    <div class=\"abx-s\" data-s=\"know\" role=\"group\" aria-label=\"Knowledge\"><div class=\"abx-sh\"><span>Knowledge</span></div><div class=\"abx-kn\"></div></div>\n    <div class=\"abx-s\" data-s=\"trig\" role=\"group\" aria-label=\"Trigger\"><div class=\"abx-sh\"><span>Trigger</span></div>\n      <div class=\"abx-tr\"><div class=\"seg2 abx-trs\" role=\"group\" aria-label=\"Starts on\"><button aria-pressed=\"true\" data-v=\"chat\">Chat</button><button aria-pressed=\"false\" data-v=\"sched\">Schedule</button><button aria-pressed=\"false\" data-v=\"event\">Event</button></div><span class=\"muted abx-trd\">When someone messages it</span></div>\n    </div>\n    <div class=\"abx-bar\"><span class=\"abx-st muted\">Not saved</span><span class=\"sp\"></span><button class=\"pill line sm abx-test\">{play}Test</button><button class=\"pill line sm abx-save\">Save</button><button class=\"pill primary sm abx-pub\">Publish</button></div>\n  </div>\n  <div class=\"abx-c\">\n    <div class=\"abx-ch\"><div class=\"abx-cht\"><b>Test</b><span class=\"muted abx-cs\">Try it before it goes live</span></div></div>\n    <div class=\"abx-log\" aria-live=\"polite\"><p class=\"muted abx-empty\">Draft the agent, then press Test to send it a sample email.</p></div>\n  </div>\n  </div><p class=\"abx-sr\" role=\"status\"></p>\n</div>";
TPLS["model-compare"] = "<div class=\"mcx panel\">\n  <form class=\"mcx-in\">\n    <div class=\"mcx-fd\"><input class=\"mcx-q\" value=\"Write a one line value prop for the Pro plan\" aria-label=\"Prompt for every model\" spellcheck=\"false\" autocomplete=\"off\"><span class=\"mcx-n num\">3 models</span></div>\n    <button type=\"button\" class=\"pill ghost sm mcx-add\" data-pop=\".mcx-pa\" data-pop-align=\"end\" aria-haspopup=\"menu\" aria-expanded=\"false\" hidden>{plus}Add model</button>\n    <button type=\"submit\" class=\"pill primary sm mcx-go\" data-tip=\"Run on every model\" data-tip-k=\"↵\">Run</button>\n  </form>\n  <div class=\"pop mcx-pop mcx-pa\" role=\"menu\" aria-label=\"Add a model\"></div>\n  <div class=\"mcx-cols\"></div>\n  <p class=\"mcx-live\" aria-live=\"polite\"></p>\n</div>";
TPLS["memory-panel"] = "<div class=\"mmx panel\" data-reveal=\"flat\">\n  <div class=\"mmx-h\"><span class=\"mmx-ic\">{book}</span><div class=\"mmx-ht\"><b>Team memory</b><span class=\"mmx-sub\"><span class=\"muted mmx-st\">7 memories</span><span class=\"mmx-srcs\" aria-hidden=\"true\"></span></span></div><div class=\"seg2 mmx-tab\" role=\"group\" aria-label=\"Filter\"><button aria-pressed=\"true\" data-v=\"all\">All</button><button aria-pressed=\"false\" data-v=\"brand\">Brand</button><button aria-pressed=\"false\" data-v=\"process\">Process</button></div></div>\n  <div class=\"mmx-list\"></div>\n  <div class=\"mmx-f\" aria-live=\"polite\"><span class=\"mmx-fi\" aria-hidden=\"true\">{spark}</span><span class=\"mmx-ft\">Used in 14 answers this week</span></div>\n</div>";
TPLS["command-palette"] = "<div class=\"cpl panel\">\n  <div class=\"cpl-in\">{search}<input class=\"cpl-q\" placeholder=\"Search or ask the agent\" aria-label=\"Command\" spellcheck=\"false\"><span class=\"kbd\">esc</span></div>\n  <div class=\"cpl-list\" role=\"listbox\"></div>\n  <div class=\"cpl-f muted\"><span><span class=\"kbd\">↑</span><span class=\"kbd\">↓</span> move</span><span><span class=\"kbd\">↵</span> run</span><span class=\"cpl-st\"></span></div>\n</div>";
TPLS["run-drawer"] = "<div class=\"rdr\" data-reveal=\"flat\">\n  <div class=\"rdr-cv\"><div class=\"rdr-flow\" role=\"group\" aria-label=\"Steps of the workflow\"></div></div>\n  <div class=\"rdr-dw\" role=\"region\" aria-label=\"Run\">\n    <div class=\"rdr-grip\" role=\"separator\" aria-orientation=\"horizontal\" aria-label=\"Resize the run drawer\" tabindex=\"0\" aria-valuemin=\"120\" aria-valuemax=\"408\" aria-valuenow=\"312\"><i></i></div>\n    <div class=\"rdr-h\">\n      <button class=\"rdr-tg\" aria-expanded=\"true\">{chev-u.xs}<span><span class=\"w\">Test run </span><span class=\"rdr-id num\">#2088</span></span><span class=\"rdr-st tag run\"><span class=\"spin\"></span>Running</span></button>\n      <span class=\"rdr-meta num\"></span>\n      <span class=\"rdr-sp\"></span>\n      <div class=\"seg2 rdr-tabs\" role=\"group\" aria-label=\"Show\"><button aria-pressed=\"true\" data-v=\"steps\">Steps</button><button aria-pressed=\"false\" data-v=\"log\">Log</button><button aria-pressed=\"false\" data-v=\"data\">Data</button></div>\n      <button class=\"pill ghost sm rdr-stop\" aria-label=\"Stop the run\" data-tip=\"Stop the run\">{stop.xs}<span>Stop</span></button>\n      <button class=\"pill ghost sm rdr-again\" aria-label=\"Run again\" data-tip=\"Run again\" hidden>{refresh.xs}<span>Run again</span></button>\n      <button class=\"ib rdr-follow\" aria-pressed=\"true\" aria-label=\"Follow the run\" data-tip=\"Follow the run\">{target}</button>\n    </div>\n    <div class=\"rdr-b\">\n      <div class=\"rdr-v\" data-v=\"steps\"><div class=\"rdr-ax\" aria-hidden=\"true\"><span>Step</span><span class=\"rdr-sc\"></span><span class=\"ms\">Time</span></div><div class=\"rdr-rows\" role=\"group\" aria-label=\"Steps of the run\"></div></div>\n      <div class=\"rdr-v\" data-v=\"log\" hidden><div class=\"rdr-lf\"><div class=\"seg2 rdr-lvs\" role=\"group\" aria-label=\"Level\"><button aria-pressed=\"true\" data-v=\"all\">All</button><button aria-pressed=\"false\" data-v=\"warn\">Warnings</button><button aria-pressed=\"false\" data-v=\"error\">Errors</button></div><span class=\"n num\"></span></div><ol class=\"rdr-log\" aria-label=\"Run log\"></ol></div>\n      <div class=\"rdr-v\" data-v=\"data\" hidden><div class=\"rdr-data\"><div class=\"rdr-ds\" role=\"group\" aria-label=\"Steps\"></div><div class=\"rdr-io\"></div></div></div>\n    </div>\n    <p class=\"rdr-live\" aria-live=\"polite\"></p>\n  </div>\n</div>";
TPLS["data-picker"] = "<div class=\"fpk\">\n  <div class=\"fpk-hd\"><span class=\"fpk-ti\" data-k=\"app\" aria-hidden=\"true\">{mail}</span><b>Send the reply</b><span class=\"muted\">Step 6 of 7</span></div>\n  <div class=\"fpk-f\" data-f=\"to\"><span class=\"fpk-l\">To</span><div class=\"fpk-box\" role=\"group\" aria-label=\"To\"></div></div>\n  <div class=\"fpk-f\" data-f=\"subject\"><span class=\"fpk-l\">Subject</span><div class=\"fpk-box\" role=\"group\" aria-label=\"Subject\"></div></div>\n  <div class=\"fpk-f\" data-f=\"body\"><span class=\"fpk-l\">Body</span><div class=\"fpk-box\" role=\"group\" aria-label=\"Body\"></div></div>\n  <div class=\"pop fpk-pop\" role=\"dialog\" aria-label=\"Pick data from an earlier step\">\n    <div class=\"fpk-q\">{search}<input type=\"text\" role=\"combobox\" aria-expanded=\"true\" aria-autocomplete=\"list\" placeholder=\"Find a field\" aria-label=\"Find a field\" autocomplete=\"off\" spellcheck=\"false\"></div>\n    <div class=\"fpk-ls\" role=\"listbox\" aria-label=\"Fields from earlier steps\"></div>\n    <p class=\"fpk-ft\"><span>From the 4 steps before Send the reply</span><span class=\"kh\" aria-hidden=\"true\"><span class=\"kbd\">↑</span> <span class=\"kbd\">↓</span> <span class=\"kbd\">↵</span></span></p>\n  </div>\n  <p class=\"fpk-live\" aria-live=\"polite\"></p>\n</div>";
TPLS["step-inspector"] = "<div class=\"sti-dm dm\"><div class=\"dm-main\">\n  <div class=\"sti panel\" data-k=\"ai\">\n    <div class=\"sti-h\">\n      <span class=\"sti-ti\" data-k=\"ai\" aria-hidden=\"true\">{spark}</span>\n      <span class=\"sti-tx\"><span class=\"sti-nr\"><input class=\"sti-n\" value=\"Research and score\" aria-label=\"Step name\" maxlength=\"40\" spellcheck=\"false\" autocomplete=\"off\"></span><span class=\"sti-kd\">AI step, step 2 of 7</span></span>\n      <button class=\"ib sti-test\" aria-label=\"Test this step\" data-tip=\"Test this step\">{play}</button>\n      <button class=\"ib sti-more\" data-pop=\".sti-mm\" data-pop-align=\"end\" aria-haspopup=\"menu\" aria-expanded=\"false\" aria-label=\"Step actions\" data-tip=\"More\">{more}</button>\n    </div>\n    <div class=\"sti-body\"></div>\n    <div class=\"pop sti-pk\" role=\"menu\" aria-label=\"Options\"></div>\n    <div class=\"pop sti-dp\" role=\"menu\" aria-label=\"Data from earlier steps\"></div>\n    <div class=\"pop sti-mm\" role=\"menu\" aria-label=\"Step actions\">\n      <button class=\"mi\" role=\"menuitem\" tabindex=\"-1\" data-a=\"rename\" data-close>{edit}<span>Rename</span></button>\n      <button class=\"mi\" role=\"menuitem\" tabindex=\"-1\" data-a=\"off\" data-close>{pause}<span>Turn off</span></button>\n    </div>\n    <p class=\"sti-live\" aria-live=\"polite\"></p>\n  </div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Step\"><button aria-pressed=\"true\" data-v=\"ai\">AI step</button><button aria-pressed=\"false\" data-v=\"branch\">Branch</button><button aria-pressed=\"false\" data-v=\"approval\">Approval</button></div></div>\n</div>";
TPLS["canvas-toolbar"] = "<div class=\"ctb\" data-tool=\"select\" data-reveal=\"flat\">\n  <div class=\"ctb-cv\" tabindex=\"0\" role=\"group\" aria-roledescription=\"canvas\" aria-label=\"Workflow canvas\" aria-describedby=\"\">\n    <div class=\"ctb-world\"><svg class=\"ctb-w\" aria-hidden=\"true\"></svg><div class=\"ctb-nodes\"></div></div>\n    <svg class=\"ctb-lz\" aria-hidden=\"true\"><path d=\"\"/></svg>\n    <div class=\"ctb-mq\" hidden></div>\n    <span class=\"ctb-sr\">V, H and L pick a tool, C adds a comment, Shift 1 fits the workflow to the screen, minus and plus zoom, and the arrow keys move the view.</span>\n  </div>\n  <div class=\"ctb-bar\" role=\"toolbar\" aria-label=\"Canvas tools\">\n    <button class=\"pill primary ctb-run\">{play}<span>Run</span></button>\n    <span class=\"ctb-sep\"></span>\n    <div class=\"ctb-tools\" role=\"radiogroup\" aria-label=\"Tool\">\n      <button class=\"ctb-b\" role=\"radio\" aria-checked=\"true\" data-t=\"select\" aria-label=\"Select\" data-tip=\"Select\" data-tip-k=\"V\">{cursor}</button>\n      <button class=\"ctb-b\" role=\"radio\" aria-checked=\"false\" tabindex=\"-1\" data-t=\"hand\" aria-label=\"Hand\" data-tip=\"Pan\" data-tip-k=\"H\">{hand}</button>\n      <button class=\"ctb-b\" role=\"radio\" aria-checked=\"false\" tabindex=\"-1\" data-t=\"lasso\" aria-label=\"Lasso\" data-tip=\"Lasso select\" data-tip-k=\"L\">{lasso}</button>\n    </div>\n    <span class=\"ctb-sep\" data-ovf=\"1\"></span>\n    <button class=\"ctb-b ctb-cm\" data-ovf=\"1\" aria-pressed=\"false\" aria-label=\"Comment\" data-tip=\"Comment\" data-tip-k=\"C\">{comment}</button>\n    <button class=\"ctb-b ctb-fit\" data-ovf=\"1\" aria-label=\"Fit to screen\" data-tip=\"Fit to screen\" data-tip-k=\"⇧1\">{fit}</button>\n    <span class=\"ctb-sep\" data-ovf=\"2\"></span>\n    <button class=\"ctb-b ctb-zo\" data-ovf=\"2\" aria-label=\"Zoom out\" data-tip=\"Zoom out\" data-tip-k=\"−\">{minus}</button>\n    <button class=\"ctb-z num\" data-ovf=\"2\" aria-label=\"Zoom 100%, reset to 100%\" data-tip=\"Zoom to 100%\" data-tip-k=\"⇧0\">100%</button>\n    <button class=\"ctb-b ctb-zi\" data-ovf=\"2\" aria-label=\"Zoom in\" data-tip=\"Zoom in\" data-tip-k=\"+\">{plus}</button>\n    <button class=\"ctb-b ctb-more\" aria-label=\"More tools\" aria-haspopup=\"menu\" aria-expanded=\"false\" data-pop=\".ctb-menu\" data-pop-pos=\"up\" data-pop-align=\"end\" data-tip=\"More\">{more}</button>\n  </div>\n  <div class=\"pop ctb-menu\" role=\"menu\" aria-label=\"More tools\">\n    <button class=\"mi\" role=\"menuitemcheckbox\" aria-checked=\"false\" tabindex=\"-1\" data-a=\"comment\" data-ovf=\"1\" data-close>{comment}<span>Comment</span><span class=\"kbd\">C</span></button>\n    <button class=\"mi\" role=\"menuitem\" tabindex=\"-1\" data-a=\"fit\" data-ovf=\"1\" data-close>{fit}<span>Fit to screen</span><span class=\"kbd\">⇧1</span></button>\n    <button class=\"mi\" role=\"menuitem\" tabindex=\"-1\" data-a=\"out\" data-ovf=\"2\">{minus}<span>Zoom out</span><span class=\"kbd\">−</span></button>\n    <button class=\"mi\" role=\"menuitem\" tabindex=\"-1\" data-a=\"in\" data-ovf=\"2\">{plus}<span>Zoom in</span><span class=\"kbd\">+</span></button>\n    <button class=\"mi\" role=\"menuitem\" tabindex=\"-1\" data-a=\"reset\" data-ovf=\"2\" data-close>{zoom}<span>Zoom to 100%</span><span class=\"r num ctb-zl\">100%</span></button>\n  </div>\n  <div class=\"pop ctb-cp\" role=\"dialog\" aria-label=\"Comment\"><b class=\"ctb-ct\"></b><p class=\"ctb-cw\"></p><button class=\"pill line sm ctb-del\">{trash}Delete</button></div>\n  <p class=\"ctb-live\" aria-live=\"polite\"></p>\n</div>";
TPLS["automation-canvas"] = "<div class=\"acx\" data-reveal=\"flat\">\n  <div class=\"acx-top\"><span class=\"acx-name\">Weekly design QA</span><span class=\"tag ok acx-on\">On</span></div>\n  <div class=\"acx-cv\" tabindex=\"0\" role=\"group\" aria-roledescription=\"canvas\" aria-label=\"Automation canvas\">\n    <div class=\"acx-vp\"><div class=\"acx-world\"><svg class=\"acx-svg\" aria-hidden=\"true\"></svg><div class=\"acx-nodes\"></div></div><div class=\"acx-mq\" hidden></div></div>\n    <div class=\"acx-bar\"><button class=\"pill primary sm acx-run\">{play}Test run</button><span class=\"muted acx-st\">Every Monday, 9:00</span></div>\n    <div class=\"acx-zm\" role=\"toolbar\" aria-label=\"Zoom\">\n      <button class=\"acx-zb acx-zo\" aria-label=\"Zoom out\" data-tip=\"Zoom out\" data-tip-k=\"−\">{minus}</button>\n      <button class=\"acx-zl num\" aria-label=\"Zoom 100%, reset to 100%\" data-tip=\"Zoom to 100%\">100%</button>\n      <button class=\"acx-zb acx-zi\" aria-label=\"Zoom in\" data-tip=\"Zoom in\" data-tip-k=\"+\">{plus}</button>\n      <span class=\"acx-zs\"></span>\n      <button class=\"acx-zb acx-fit\" aria-label=\"Fit to screen\" data-tip=\"Fit to screen\" data-tip-k=\"0\">{fit}</button>\n    </div>\n    <span class=\"acx-sr\">Drag the empty canvas or scroll to move around, and Control or Command with the scroll wheel, or a pinch, to zoom. With the canvas focused the arrow keys move the view, plus and minus zoom, and 0 or 1 fits it. Shift-click a step to add it to the selection, and Escape clears it.</span>\n    <div class=\"pop acx-pop\" role=\"dialog\"></div>\n    <div class=\"pop acx-pk\" role=\"dialog\" aria-label=\"Add a step\">\n      <div class=\"acx-q\">{search}<input class=\"acx-qi\" type=\"text\" role=\"combobox\" aria-expanded=\"true\" aria-autocomplete=\"list\" placeholder=\"Search steps\" aria-label=\"Search steps\" autocomplete=\"off\" spellcheck=\"false\"></div>\n      <div class=\"acx-ls\" role=\"listbox\" aria-label=\"Steps\"></div>\n      <p class=\"acx-pd\" aria-hidden=\"true\"></p>\n    </div>\n  </div>\n  <p class=\"acx-live\" aria-live=\"polite\"></p>\n</div>";

/* ---------- Workspace rail ---------- */
DM.def('workspace-rail', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{panel}', I('panel'));
  const N = [['home','Home',0],['spark','Agent',2],['layers','Projects',0],['figma','Frames',0],['book','Memory',0],['gear','Settings',0]];
  const nav = $('.wrx-nav', r), ind = $('.wrx-ind', r), root = $('.wrx', r), mh = $('.wrx-mh', r);
  nav.insertAdjacentHTML('beforeend', N.map((n, i) => `<button class="wrx-i${i === 1 ? ' on' : ''}" data-i="${i}" aria-label="${n[1]}" data-tip="${n[1]}">${I(n[0])}${n[2] ? `<span class="bd">${n[2]}</span>` : ''}<span class="wrx-lb">${n[1]}</span></button>`).join(''));
  $('.wrx-runs', r).insertAdjacentHTML('beforeend', ['Pricing audit','Token export'].map(t => `<button class="wrx-run" data-tip="${t}"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="wrx-lb">${t}</span></button>`).join(''));
  const items = $$('.wrx-i[data-i]', nav);
  function go(b){ items.forEach(x => x.classList.toggle('on', x === b)); ind.style.top = b.offsetTop + 'px'; swap(mh, N[+b.dataset.i][1]); const bd = $('.bd', b); if (bd){ bd.classList.add('leave'); c.later(300, () => bd.remove()); } }
  items.forEach(b => b.onclick = () => go(b));
  const tipSync = () => $$('[data-tip]', $('.wrx-rail', r)).forEach(el => { if (!el.dataset.t0) el.dataset.t0 = el.dataset.tip; if (root.classList.contains('wide') && !el.classList.contains('wrx-pin')) el.removeAttribute('data-tip'); else el.dataset.tip = el.dataset.t0; });
  $('.wrx-pin', r).onclick = () => { root.classList.toggle('wide'); const w = root.classList.contains('wide'); $('.wrx-pin', r).dataset.t0 = w ? 'Collapse' : 'Pin open'; tipSync(); };
  mh.textContent = 'Agent'; requestAnimationFrame(() => ind.style.top = items[1].offsetTop + 'px');
  // the preview pins the rail open once on its own, unless you take over first
  c.auto(1500, () => { root.classList.add('wide'); $('.wrx-pin', r).dataset.t0 = 'Collapse'; tipSync(); });
});
/* ---------- Command palette ---------- */
DM.def('command-palette', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{search}', I('search'));
  // [group, icon, label, keys, hint]; each group's tiles take its hue
  const C = [
    ['Agent','spark','Audit this page for contrast',['⌘','J'],'WCAG AA'],
    ['Agent','wand','Tidy layer names in the selection',null,'12 layers'],
    ['Agent','code','Export tokens as CSS variables',null,'tokens.css'],
    ['Go to','layers','Pricing v4',['G','P'],'Page'],
    ['Go to','figma','Checkout flow',null,'Figma file'],
    ['Go to','book','Memory',null,'Team notes'],
    ['Actions','users','Invite a teammate',null,'Acme Labs'],
    ['Actions','gear','Agent settings',['⌘',',']],
    ['Actions','palette','Switch theme',null,'Light']
  ];
  const TONE = { Agent:'pl', 'Go to':'pb', Actions:'pt' };
  const q = $('.cpl-q', r), list = $('.cpl-list', r), st = $('.cpl-st', r);
  list.id = 'cpl-l-' + Math.random().toString(36).slice(2, 7); list.setAttribute('aria-label', 'Commands'); list.tabIndex = -1;
  q.setAttribute('role', 'combobox'); q.setAttribute('aria-expanded', 'true'); q.setAttribute('aria-controls', list.id); q.setAttribute('aria-autocomplete', 'list');
  let items = [], hi = 0, last = C.map(x => x[2]).join('|');
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function paint(){
    const v = q.value.trim(), re = v ? new RegExp('(' + v.split('').map(esc).join(').*?(') + ')', 'i') : null;
    const m = C.filter(x => !re || re.test(x[2]));
    // the rows play a short cascade only when the list changes, not on every letter that keeps it as it is
    const key = m.map(x => x[2]).join('|') + (v ? '|ask' : ''), fresh = key !== last; last = key;
    let h = '<span class="cpl-hl"></span>', g = '', n = 0;
    const cls = () => fresh ? ` in" style="animation-delay:${Math.min(n++, 6) * 28}ms` : '';
    m.forEach(x => { if (x[0] !== g){ g = x[0]; h += `<div class="cpl-g">${g}</div>`; } const label = v ? x[2].replace(new RegExp(v.split('').map(esc).join('|'), 'gi'), s => `<mark>${s}</mark>`) : x[2], t = TONE[x[0]];
      h += `<button class="cpl-i${cls()}" role="option" data-t="${x[2]}"><span class="ic" style="--tc:var(--${t});--tb:var(--${t}-bg)">${I(x[1],'xs')}</span><span class="t">${label}</span>${x[4] ? `<span class="h">${x[4]}</span>` : ''}${x[3] ? `<span class="k">${x[3].map(k => `<span class="kbd">${k}</span>`).join('')}</span>` : ''}</button>`; });
    if (v) h += `<div class="cpl-g">Ask</div><button class="cpl-i ask${cls()}" data-t="${v.replace(/"/g,'&quot;')}" data-ask="1"><span class="ic">${I('spark','xs')}</span><span class="t">Ask the agent <span class="q">“${v.replace(/</g,'&lt;')}”</span></span><span class="kbd ent">↵</span></button>`;
    list.innerHTML = h; items = $$('.cpl-i', list); hi = 0;
    // the search box keeps the focus and points at the highlighted row (aria-activedescendant), so the rows are not tab stops
    items.forEach((b, i) => { b.id = list.id + '-' + i; b.tabIndex = -1; b.setAttribute('role', 'option'); b.onmouseenter = () => move(i - hi); b.onclick = () => run(b); });
    if (!items.length) q.removeAttribute('aria-activedescendant'); move(0); edge();
  }
  function move(d){ if (!items.length) return; hi = (hi + d + items.length) % items.length; items.forEach((b, i) => { b.classList.toggle('hl', i === hi); b.setAttribute('aria-selected', i === hi); }); const b = items[hi], hl = $('.cpl-hl', list); q.setAttribute('aria-activedescendant', b.id); hl.style.top = b.offsetTop + 'px'; if (b.offsetTop < list.scrollTop || b.offsetTop + 36 > list.scrollTop + list.clientHeight) list.scrollTo({ top:b.offsetTop - 40, behavior:REDUCE ? 'auto' : 'smooth' }); }
  const edge = () => list.classList.toggle('more', list.scrollTop + list.clientHeight < list.scrollHeight - 2);
  c.on(list, 'scroll', edge, { passive:true });
  // a command that runs turns its tile into a spinner for a beat, then the footer says what ran
  function run(b){
    b.animate([{ transform:'scale(1)' },{ transform:'scale(.98)' },{ transform:'scale(1)' }], { duration:260, easing:'ease-out' });
    const ic = $('.ic', b), was = ic.innerHTML; ic.innerHTML = '<span class="spin"></span>';
    setTimeout(() => { if (ic.isConnected){ ic.innerHTML = was; enter(ic.firstElementChild); } swap(st, `<span class="dot"></span>${b.dataset.ask ? 'Sent to the agent' : 'Ran: ' + b.dataset.t}`, true); }, REDUCE ? 0 : 650);
  }
  q.oninput = paint;
  q.onkeydown = e => { if (e.key === 'ArrowDown'){ move(1); e.preventDefault(); } else if (e.key === 'ArrowUp'){ move(-1); e.preventDefault(); } else if (e.key === 'Enter' && items[hi]) run(items[hi]); else if (e.key === 'Escape'){ q.value = ''; paint(); } };
  paint();
  // the preview's story: someone types "tok" and runs the token export, then looks for "invi" and runs the invite; clicking,
  // focusing or typing in it takes over, and what it had typed goes
  c.story(async s => {
    await s.beat(3);
    await s.type(q, 'tok', { n:.36, each:paint });
    await s.beat(2); run(items[hi]); await s.beat(4);
    await s.type(q, '', { n:.36, each:paint, clear:true }); await s.beat(1);
    await s.type(q, 'invi', { n:.36, each:paint });
    await s.beat(2); run(items[hi]); await s.beat(4);
  });
});
/* ---------- Agent settings ---------- */
DM.def('agent-settings', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{minus}', I('minus','xs')).replace('{plus}', I('plus','xs'));
  const root = $('.asx', r), steps = $$('.asx-steps button', r), knob = $('.asx-knob', r), ad = $('.asx-ad', r), tg = $$('.toggle', r), v = $('.asx-v', r), ta = $('.asx-ta', r);
  const AD = ['Asks before every change', 'Asks before edits to shared files', 'Works alone, asks only before publishing'];
  const CAPS = [1, 2, 5, 10, 20, 50];
  let s = { a:1, t:[true,false], cap:2, i:ta.value }, saved = JSON.stringify(s);
  // the bar of unsaved changes is out of reach while it's hidden; when it hides with the focus in it, the focus goes to the
  // top of the form instead of the page
  const dirty = () => { const bar = $('.asx-bar', r), was = root.classList.contains('dirty'), on = root.classList.toggle('dirty', JSON.stringify(s) !== saved); bar.inert = !on;
    if (was && !on && bar.contains(document.activeElement)){ const to = $('[aria-checked="true"]', r) || $('button', r); if (to) to.focus({ preventScroll:true }); } };
  function setA(i, init){ s.a = i; steps.forEach((b, j) => b.setAttribute('aria-checked', j === i)); knob.style.left = `calc(3px + ${i} * (100% - 6px) / 3)`; if (!init) swap(ad, AD[i]); dirty(); }
  steps.forEach((b, i) => b.onclick = () => setA(i));
  tg.forEach((t, i) => t.onclick = () => { s.t[i] = !s.t[i]; t.setAttribute('aria-checked', s.t[i]); dirty(); });
  const cap = d => { s.cap = Math.max(0, Math.min(CAPS.length - 1, s.cap + d)); swap(v, '$' + CAPS[s.cap]); dirty(); };
  $('.asx-m', r).onclick = () => cap(-1); $('.asx-p', r).onclick = () => cap(1);
  ta.oninput = () => { s.i = ta.value; dirty(); };
  function apply(o){ s = JSON.parse(o); setA(s.a, true); swap(ad, AD[s.a]); tg.forEach((t, i) => t.setAttribute('aria-checked', s.t[i])); v.textContent = '$' + CAPS[s.cap]; ta.value = s.i; dirty(); }
  $('.asx-rs', r).onclick = () => apply(saved);
  $('.asx-sv', r).onclick = () => c.run(async () => { const b = $('.asx-sv', r); b.innerHTML = '<span class="spin"></span>'; await c.wait(600); saved = JSON.stringify(s); b.innerHTML = I('check','xs') + 'Saved'; await c.wait(700); dirty(); b.textContent = 'Save'; });
  setA(1, true);
  // the preview flips one switch on its own, unless you take over first
  c.auto(1400, () => tg[1].click());
});
/* ---------- Agent settings designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and the others are the
   directions under review. The switch is the card's alone: the registry, the code view and the component page install
   Classic on its own (build.js leaves a data-designs="card" switch out of them) */
{
  const classic = DM.defs['agent-settings'];
  // the tools Live preview, Tabs and Presets name, each with its mark, and the autonomy levels
  const ASX_TOOLS = [['files', 'Files in the repo', null, 'file-text'], ['github', 'GitHub', 'github'], ['figma', 'Figma', 'figma'], ['slack', 'Slack', 'slack'], ['linear', 'Linear', 'linear']];
  const asxApp = ([id, n, b, ic]) => `<span class="asx-app" aria-hidden="true">${b ? BRAND[b] : I(ic, 'xs')}</span>`;
  const ASX_CAPS = [1, 2, 3, 5, 10, 20, 50];
  const ASX_LV = ['Ask', 'Balanced', 'Autopilot'];
  const ASX_HTML = {
    preview:`<div class="asx-lp panel">
    <div class="asx-lp-sec">
      <div class="asx-lp-l"><b>Autonomy</b><span class="asx-lp-lv">Balanced</span></div>
      <div class="asx-lp-sl" role="slider" tabindex="0" aria-label="Autonomy" aria-valuemin="0" aria-valuemax="2" aria-valuenow="1" aria-valuetext="Balanced">
        <div class="asx-lp-tr"><i class="asx-lp-fill"></i><span class="asx-lp-stop" style="--x:0"></span><span class="asx-lp-stop" style="--x:.5"></span><span class="asx-lp-stop" style="--x:1"></span></div>
        <span class="asx-lp-th" aria-hidden="true"><i></i></span>
      </div>
      <div class="asx-lp-ticks"><button type="button" tabindex="-1" data-v="0">Ask</button><button type="button" tabindex="-1" data-v="1">Balanced</button><button type="button" tabindex="-1" data-v="2">Autopilot</button></div>
    </div>
    <div class="asx-lp-pv"><span class="asx-lp-pl">On a run like <b>Update the pricing page</b>, it would</span><ul class="asx-lp-acts" aria-label="What it would do"></ul></div>
    <div class="asx-lp-sec">
      <div class="asx-lp-l"><b>Spend cap per run</b><span class="asx-lp-cv num">$5</span></div>
      <input type="range" class="asx-lp-rg" min="0" max="6" step="1" value="3" aria-label="Spend cap per run" aria-valuetext="$5">
      <span class="asx-lp-est num">About 40 runs a month on your plan</span>
    </div>
    <div class="asx-lp-bar" inert><span class="asx-lp-bt">Unsaved changes</span><button class="pill ghost sm asx-lp-rs" type="button">Reset</button><button class="pill primary sm asx-lp-sv" type="button">Save</button></div>
  </div>`,
    tabs:`<div class="asx-tb panel">
    <div class="asx-tb-tabs" role="tablist" aria-label="Settings"><span class="asx-tb-kn" aria-hidden="true"></span></div>
    <div class="asx-tb-pane" role="tabpanel"></div>
    <div class="asx-tb-ft">
      <div class="fold shut asx-tb-cf"><div><ul class="asx-tb-cl" aria-label="Unsaved changes"></ul></div></div>
      <div class="asx-tb-bar"><span class="asx-tb-st" aria-live="polite">No unsaved changes</span><button class="pill ghost sm asx-tb-rs" type="button" disabled>Discard</button><button class="pill primary sm asx-tb-sv" type="button" disabled>Save<span class="kbd">⌘S</span></button></div>
    </div>
    <div class="asx-tb-pops"></div>
  </div>`,
    presets:`<div class="asx-ps panel">
    <div class="asx-ps-pre" role="radiogroup" aria-label="Preset"></div>
    <div class="asx-ps-mx">
      <div class="asx-ps-mh" aria-hidden="true"><span></span><span>Read</span><span>Change</span><span>Publish</span></div>
      <div class="asx-ps-grid" role="grid" aria-label="What the agent may do in each tool"></div>
      <div class="asx-ps-key" aria-hidden="true"><span class="al"><i></i>Allow</span><span class="as"><i></i>Ask first</span><span class="bl"><i></i>Block</span></div>
    </div>
    <div class="asx-ps-bar"><span class="asx-ps-bt">Balanced preset</span><button class="pill ghost sm asx-ps-rs" type="button" disabled>Reset</button><button class="pill primary sm asx-ps-sv" type="button" disabled>Save</button></div>
  </div>`
  };
  // Live preview: one autonomy slider, with what the agent would do alone or ask about on a real run, and a spend cap. A bar
  // with Reset and Save rises once something has changed
  function asxPreview(r, c){
    const root = $('.asx-lp', r), sl = $('.asx-lp-sl', r), th = $('.asx-lp-th', r), fill = $('.asx-lp-fill', r), lv = $('.asx-lp-lv', r), acts = $('.asx-lp-acts', r), rg = $('.asx-lp-rg', r), cv = $('.asx-lp-cv', r), est = $('.asx-lp-est', r), bar = $('.asx-lp-bar', r), ticks = $$('.asx-lp-ticks button', r);
    // what the agent does on the run at each level: does it (al), asks first (as) or leaves it (bl)
    const A = [
      { t:'Read the pricing files', ap:ASX_TOOLS[0], v:['al', 'al', 'al'] },
      { t:'Edit shared components', ap:ASX_TOOLS[0], v:['as', 'as', 'al'] },
      { t:'Update the plan cards in Figma', ap:ASX_TOOLS[2], v:['as', 'al', 'al'] },
      { t:'Open a pull request', ap:ASX_TOOLS[1], v:['as', 'al', 'al'] },
      { t:'Post the summary in #design', ap:ASX_TOOLS[3], v:['bl', 'as', 'al'] },
      { t:'Merge to main', ap:ASX_TOOLS[1], v:['bl', 'as', 'as'] }
    ];
    const P = { al:[I('check','xs'), 'Does it'], as:[I('hand','xs'), 'Asks first'], bl:[I('slash','xs'), 'Leaves it'] };
    acts.innerHTML = A.map(a => `<li class="asx-lp-a">${asxApp(a.ap)}<span class="t">${a.t}</span><span class="tag asx-lp-pill"></span></li>`).join('');
    const pills = $$('.asx-lp-pill', acts);
    let lev = 1, cap = 3, saved = { lev:1, cap:3 }, W = 0;
    const ro = new ResizeObserver(() => { W = sl.clientWidth; th.style.setProperty('--tx', (lev / 2 * W).toFixed(1) + 'px'); }); ro.observe(sl); c.offs.push(() => ro.disconnect());
    // a verdict that changes flips in, one after another: a dip in Soft, a cut in Blueprint
    const flipIn = (el, d, bp) => { if (REDUCE || !el.animate) return; el.animate(bp ? [{ opacity:0 }, { opacity:1 }] : [{ transform:'none' }, { transform:'translateY(-4px) scale(.94)', opacity:.4, offset:.4 }, { transform:'none' }], { duration:bp ? 300 : 450, delay:d, easing:bp ? 'steps(2,end)' : 'cubic-bezier(.22,1,.36,1)', fill:'backwards' }); };
    function paint(flip){
      const bp = flip && getComputedStyle(root).getPropertyValue('--motion').trim() === 'bp';
      th.style.setProperty('--tx', (lev / 2 * W).toFixed(1) + 'px'); fill.style.setProperty('--v', lev / 2);
      sl.setAttribute('aria-valuenow', lev); sl.setAttribute('aria-valuetext', ASX_LV[lev]); swap(lv, ASX_LV[lev]);
      ticks.forEach((b, i) => b.classList.toggle('on', i === lev));
      A.forEach((a, i) => { const k = a.v[lev], p = pills[i]; if (p.dataset.k === k) return; p.dataset.k = k; p.className = 'tag asx-lp-pill' + (k === 'al' ? ' ok' : k === 'as' ? ' warn' : ''); p.innerHTML = P[k][0] + P[k][1]; if (flip) flipIn(p, i * 45, bp); });
      cv.textContent = '$' + ASX_CAPS[cap]; rg.value = cap; rg.setAttribute('aria-valuetext', '$' + ASX_CAPS[cap]); rg.style.setProperty('--f', (cap / 6 * 100).toFixed(1) + '%');
      est.textContent = `About ${Math.max(1, Math.round(200 / ASX_CAPS[cap]))} runs a month on your plan`;
      const n = (lev !== saved.lev) + (cap !== saved.cap), on = n > 0;
      // the bar is out of reach while it is hidden; when it hides with the focus in it, the focus goes back to the slider
      const was = root.classList.contains('dirty'); root.classList.toggle('dirty', on); bar.inert = !on;
      if (was && !on && bar.contains(document.activeElement)) sl.focus({ preventScroll:true });
      $('.asx-lp-bt', r).textContent = n === 1 ? '1 unsaved change' : `${n} unsaved changes`;
    }
    const set = (v, flip = true) => { v = Math.max(0, Math.min(2, v)); if (v === lev) return; lev = v; paint(flip); };
    // the slider: drag the thumb, press a stop's name, or use the arrow keys
    let drag = false, left = 0;
    const at = x => Math.round(Math.max(0, Math.min(1, (x - left) / W)) * 2);
    c.on(sl, 'pointerdown', e => { drag = true; left = sl.getBoundingClientRect().left; sl.classList.add('drag'); sl.setPointerCapture(e.pointerId); set(at(e.clientX)); });
    c.on(sl, 'pointermove', e => { if (!drag) return; th.style.setProperty('--tx', Math.max(0, Math.min(W, e.clientX - left)).toFixed(1) + 'px'); fill.style.setProperty('--v', Math.max(0, Math.min(1, (e.clientX - left) / W)).toFixed(3)); set(at(e.clientX)); });
    const up = () => { if (!drag) return; drag = false; sl.classList.remove('drag'); paint(false); };
    c.on(sl, 'pointerup', up); c.on(sl, 'pointercancel', up);
    c.on(sl, 'keydown', e => { const d = { ArrowRight:1, ArrowUp:1, ArrowLeft:-1, ArrowDown:-1 }[e.key]; if (d){ e.preventDefault(); set(lev + d); } else if (e.key === 'Home'){ e.preventDefault(); set(0); } else if (e.key === 'End'){ e.preventDefault(); set(2); } });
    ticks.forEach(b => b.onclick = () => set(+b.dataset.v));
    rg.oninput = () => { cap = +rg.value; paint(false); };
    $('.asx-lp-rs', r).onclick = () => { lev = saved.lev; cap = saved.cap; paint(true); };
    $('.asx-lp-sv', r).onclick = () => c.run(async () => { const b = $('.asx-lp-sv', r); b.innerHTML = '<span class="spin"></span>'; await c.wait(600); saved = { lev, cap }; b.innerHTML = I('check','xs') + 'Saved'; await c.wait(800); paint(false); b.textContent = 'Save'; });
    paint(false);
    c.story(async s => {
      await s.beat(3);
      await s.tap(ticks[2]); s.away(); await s.beat(4);
      await s.tap(ticks[0]); s.away(); await s.beat(4);
      await s.tap(ticks[1]); s.away(); await s.beat(2);
      await s.point(rg, false); cap = 4; paint(false); await s.beat(2); s.away();
      await s.tap($('.asx-lp-sv', r)); s.away(); await s.beat(4);
    });
  }
  // Tabs: the settings in three tabs, General, Tools and Limits, in the site's fields and switches. A change gets an accent
  // dot by its setting and by its tab, and the save bar lists every change, oldest first, each with its own undo. Save, or
  // ⌘S (Ctrl+S) with the focus inside, saves them all; Discard puts them all back
  function asxTabs(r, c){
    const root = $('.asx-tb', r), tabs = $('.asx-tb-tabs', r), pane = $('.asx-tb-pane', r), pops = $('.asx-tb-pops', r), cf = $('.asx-tb-cf', r), cl = $('.asx-tb-cl', r), stEl = $('.asx-tb-st', r), sv = $('.asx-tb-sv', r), rs = $('.asx-tb-rs', r);
    const uid = Math.random().toString(36).slice(2, 7), KB = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘S' : 'Ctrl S';
    const saveHtml = () => `Save<span class="kbd">${KB}</span>`; sv.innerHTML = saveHtml();
    const AUTO = [['Ask first', 'Asks before every change'], ['Balanced', 'Asks before edits to shared files'], ['Autopilot', 'Works alone, asks only to publish']];
    const TIME = ['10 minutes', '30 minutes', '2 hours'];
    const onOff = v => v ? 'On' : 'Off';
    // every setting: its tab, its name in the list of changes, its value and how that reads
    const F = {
      auto:{ tab:0, n:'Autonomy', v:1, show:v => AUTO[v][0] },
      mem:{ tab:0, n:'Team memory', v:true, show:onOff },
      ins:{ tab:0, n:'Instructions', v:'Use our tokens only. Keep copy short and friendly.', show:v => v.length > 20 ? v.slice(0, 20).trim() + '…' : v || 'None' },
      github:{ tab:1, n:'GitHub', v:true, show:onOff }, figma:{ tab:1, n:'Figma', v:true, show:onOff }, slack:{ tab:1, n:'Slack', v:false, show:onOff }, linear:{ tab:1, n:'Linear', v:false, show:onOff },
      cap:{ tab:2, n:'Spend cap', v:'5', show:v => v ? '$' + v : 'None' }, time:{ tab:2, n:'Time limit', v:1, show:v => TIME[v] }, ping:{ tab:2, n:'Notify me', v:true, show:onOff }
    };
    const saved = Object.fromEntries(Object.entries(F).map(([k, f]) => [k, f.v]));
    const T = ['General', 'Tools', 'Limits'];
    tabs.insertAdjacentHTML('beforeend', T.map((t, i) => `<button class="asx-tb-t" type="button" role="tab" id="asx-tb-${uid}-${i}" aria-controls="asx-tp-${uid}" aria-selected="${!i}" tabindex="${i ? -1 : 0}"><span>${t}<i class="asx-tb-dot"></i></span></button>`).join(''));
    pane.id = 'asx-tp-' + uid; pane.setAttribute('aria-labelledby', `asx-tb-${uid}-0`);
    const tb = $$('.asx-tb-t', tabs);
    let cur = 0, order = [], saving = false, done = false;
    const changed = () => order.filter(k => F[k].v !== saved[k]);
    // the changes keep the order they were made in; one put back goes from the list
    const set = (k, v) => { F[k].v = v; done = false; if (v !== saved[k]){ if (!order.includes(k)) order.push(k); } else order = order.filter(x => x !== k); bar(); };
    // the list of changes keeps its rows: a new change slides in at the end, and one undone leaves
    const rows = new Map(), txt = (el, t) => { if (el.textContent !== t) el.textContent = t; };
    function bar(){
      const ch = changed(), n = ch.length;
      root.classList.toggle('dirty', n > 0); sv.disabled = !n; rs.disabled = !n;
      const st = n ? `${n} unsaved change${n > 1 ? 's' : ''}` : done ? 'All changes saved' : 'No unsaved changes';
      if (stEl.textContent !== st) stEl.innerHTML = (!n && done ? I('check','xs') : '') + `<span>${st}</span>`;
      tb.forEach((b, i) => { const k = ch.filter(x => F[x].tab === i).length; $('.asx-tb-dot', b).classList.toggle('on', k > 0); b.setAttribute('aria-label', `${T[i]}${k ? `, ${k} unsaved change${k > 1 ? 's' : ''}` : ''}`); });
      $$('.asx-tb-r', pane).forEach(row => { const f = $('[data-f]', row), d = $('.asx-tb-dot', row); if (f && d) d.classList.toggle('on', ch.includes(f.dataset.f)); });
      for (const [k, li] of rows) if (!ch.includes(k)){ li.remove(); rows.delete(k); }
      ch.forEach(k => {
        let li = rows.get(k);
        if (!li){
          li = html(`<li class="asx-tb-c" data-k="${k}"><span class="n">${F[k].n}</span><span class="v"><span></span>${I('right','xs')}<span></span></span><button class="ib" type="button" aria-label="Undo the change to ${F[k].n}" data-tip="Undo">${I('undo','xs')}</button></li>`);
          $('.ib', li).onclick = () => undo(k); rows.set(k, li); cl.appendChild(li); cl.scrollTop = cl.scrollHeight;
        }
        const v = $$('.v>span', li); txt(v[0], F[k].show(saved[k])); txt(v[1], F[k].show(F[k].v));
      });
      cf.classList.toggle('shut', !n); cf.inert = !n;
    }
    // undoing one: the setting goes back, and the focus moves to the next change in the list, or the tab when none is left
    function undo(k){
      const li = rows.get(k), had = li && li.contains(document.activeElement), sib = li && (li.nextElementSibling || li.previousElementSibling);
      F[k].v = saved[k]; order = order.filter(x => x !== k); if (F[k].tab === cur) draw(false); bar();
      if (had){ const to = sib && sib.isConnected ? $('.ib', sib) : tb[cur]; to.focus({ preventScroll:true }); }
    }
    const lt = (label, sub) => `<span class="asx-tb-lt"><b>${label}<i class="asx-tb-dot"></i></b>${sub ? `<span class="d">${sub}</span>` : ''}</span>`;
    const sw = k => `<button class="toggle" type="button" role="switch" data-f="${k}" aria-checked="${F[k].v}" aria-label="${F[k].n}"></button>`;
    const dd = (k, opts, label) => `<button class="asx-tb-dd" type="button" data-f="${k}" data-pop=".asx-tb-m-${k}" data-pop-align="end" data-pop-pos="down" aria-haspopup="menu" aria-expanded="false" aria-label="${label}: ${opts[F[k].v][0]}"><span>${opts[F[k].v][0]}</span>${I('chev-d','xs')}</button>`;
    const menu = (k, opts, label) => `<div class="pop asx-tb-m-${k}" role="menu" aria-label="${label}">${opts.map((o, i) => `<button class="mi" type="button" role="menuitemradio" data-close data-v="${i}" aria-checked="${F[k].v === i}" tabindex="-1"><span>${o[0]}${o[1] ? `<span class="d">${o[1]}</span>` : ''}</span></button>`).join('')}</div>`;
    const TOOLS = [['github', 'Open pull requests'], ['figma', 'Edit the files it is given'], ['slack', 'Post a summary in #design'], ['linear', 'Create and update issues']];
    function draw(anim, from){
      const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      pane.innerHTML = cur === 0
        ? `<div class="asx-tb-r">${lt('Autonomy', AUTO[F.auto.v][1])}${dd('auto', AUTO, 'Autonomy')}</div><div class="asx-tb-r">${lt('Use team memory', 'Brand rules and past decisions')}${sw('mem')}</div><div class="asx-tb-r col">${lt('Instructions')}<textarea class="asx-tb-ta" rows="2" data-f="ins" spellcheck="false" aria-label="Instructions">${esc(F.ins.v)}</textarea></div>`
        : cur === 1 ? TOOLS.map(([k, d]) => `<div class="asx-tb-r"><span class="asx-tb-lb">${asxApp(ASX_TOOLS.find(t => t[0] === k))}${lt(F[k].n, d)}</span>${sw(k)}</div>`).join('')
        : `<div class="asx-tb-r">${lt('Spend cap per run', 'Pauses and asks when reached')}<label class="asx-tb-num"><span>$</span><input data-f="cap" inputmode="numeric" maxlength="4" autocomplete="off" spellcheck="false" aria-label="Spend cap per run, in dollars" value="${F.cap.v}"></label></div><div class="asx-tb-r">${lt('Time limit', 'Stops the run and keeps its work')}${dd('time', TIME.map(t => [t]), 'Time limit')}</div><div class="asx-tb-r">${lt('Notify me', 'A Slack message when it needs a decision')}${sw('ping')}</div>`;
      pops.innerHTML = cur === 0 ? menu('auto', AUTO, 'Autonomy') : cur === 2 ? menu('time', TIME.map(t => [t]), 'Time limit') : '';
      if (anim){ pane.style.setProperty('--from', (from || 8) + 'px'); pane.classList.remove('go'); void pane.offsetWidth; pane.classList.add('go'); }
      $$('.toggle', pane).forEach(t => t.onclick = () => { const k = t.dataset.f; set(k, !F[k].v); t.setAttribute('aria-checked', String(F[k].v)); });
      $$('.asx-tb-dd', pane).forEach(b => { const k = b.dataset.f, opts = k === 'auto' ? AUTO : TIME.map(t => [t]);
        $$('.mi', pops).forEach(m => { if (!m.closest(`.asx-tb-m-${k}`)) return; m.addEventListener('click', () => {
          set(k, +m.dataset.v); $$(`.asx-tb-m-${k} .mi`, pops).forEach(x => x.setAttribute('aria-checked', String(x === m)));
          swap($('span', b), opts[F[k].v][0]); b.setAttribute('aria-label', `${k === 'auto' ? 'Autonomy' : 'Time limit'}: ${opts[F[k].v][0]}`);
          if (k === 'auto') swap($('.asx-tb-lt .d', b.closest('.asx-tb-r')), AUTO[F.auto.v][1]);
        }); }); });
      const ta = $('.asx-tb-ta', pane); if (ta) ta.oninput = () => set('ins', ta.value);
      const cap = $('[data-f="cap"]', pane); if (cap) cap.oninput = () => capIn(cap);
      bar();
    }
    // the cap takes whole dollars
    const capIn = el => { const d = el.value.replace(/\D/g, '').replace(/^0+(?=\d)/, ''); if (el.value !== d) el.value = d; set('cap', d); };
    function go(i, focus){
      if (i !== cur){
        const d = i > cur ? 12 : -12; cur = i;
        tb.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
        tabs.style.setProperty('--i', i); pane.setAttribute('aria-labelledby', tb[i].id);
        if (openPop && r.contains(openPop.pop)) closePops();
        draw(true, d);
      }
      if (focus) tb[i].focus({ preventScroll:true });
    }
    tb.forEach((b, i) => b.onclick = () => go(i));
    // the tabs' keys: left and right move between them, Home and End go to the first and last
    c.on(tabs, 'keydown', e => { const n = T.length, d = { ArrowRight:1, ArrowLeft:-1 }[e.key]; const to = d ? (cur + d + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1; if (to < 0) return; e.preventDefault(); go(to, true); });
    function save(){
      if (saving || !changed().length) return; saving = true;
      if (openPop && r.contains(openPop.pop)) closePops();
      c.run(async () => {
        sv.innerHTML = '<span class="spin"></span>';
        await c.wait(600);
        Object.keys(F).forEach(k => saved[k] = F[k].v); order = []; done = true; saving = false;
        sv.innerHTML = saveHtml(); bar();
        if (cf.contains(document.activeElement) || sv === document.activeElement) tb[cur].focus({ preventScroll:true });
      });
    }
    sv.onclick = save;
    rs.onclick = () => { Object.keys(F).forEach(k => F[k].v = saved[k]); order = []; draw(false); tb[cur].focus({ preventScroll:true }); };
    // ⌘S or Ctrl+S saves while the focus is in the settings
    c.on(r, 'keydown', e => { if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 's'){ e.preventDefault(); save(); } });
    draw(false);
    c.story(async s => {
      await s.beat(3);
      await s.tap($('[data-f="auto"]', pane)); await s.beat(2);
      await s.tap($('.asx-tb-m-auto [data-v="2"]', pops)); s.away(); await s.beat(3);
      await s.tap(tb[1]); s.away(); await s.beat(2);
      await s.tap($('[data-f="slack"]', pane)); s.away(); await s.beat(2);
      await s.tap(tb[2]); s.away(); await s.beat(2);
      const cap = $('[data-f="cap"]', pane); await s.point(cap, false); await s.type(cap, '10', { clear:true, n:.3, each:() => capIn(cap) }); s.away(); await s.beat(4);
      const u = $('.asx-tb-c[data-k="auto"] .ib', cl); if (u){ await s.tap(u); s.away(); } await s.beat(3);
      await s.tap(sv); s.away(); await s.beat(5);
    });
  }
  // Presets: Careful, Balanced and Bold, then a grid of allow, ask and block for each tool to fine-tune. A preset you pick
  // fills the grid; a cell you press moves on, allow then ask then block
  function asxPresets(r, c){
    const root = $('.asx-ps', r), pre = $('.asx-ps-pre', r), grid = $('.asx-ps-grid', r), bt = $('.asx-ps-bt', r), sv = $('.asx-ps-sv', r), rs = $('.asx-ps-rs', r);
    const COLS = ['Read', 'Change', 'Publish'], ORDER = ['al', 'as', 'bl'], NAME = { al:'Allow', as:'Ask', bl:'Block' }, ICON = { al:'check', as:'hand', bl:'slash' };
    // each preset: what it lets the agent do in each tool, read, change and publish, and how far it trusts the agent
    const PRE = [
      { id:'care', n:'Careful', d:'Asks before it changes anything', ic:'shield', m:1, g:{ files:'al as bl', github:'al as bl', figma:'al as bl', slack:'al bl bl', linear:'al as bl' } },
      { id:'bal', n:'Balanced', d:'Changes alone, asks to publish', ic:'gauge', m:2, g:{ files:'al al as', github:'al al as', figma:'al al as', slack:'al as as', linear:'al al as' } },
      { id:'bold', n:'Bold', d:'Works alone, asks only to merge', ic:'rocket', m:3, g:{ files:'al al al', github:'al al as', figma:'al al al', slack:'al al al', linear:'al al al' } }
    ];
    pre.innerHTML = PRE.map((p, i) => `<button class="asx-ps-p" type="button" role="radio" data-p="${p.id}" aria-checked="${p.id === 'bal'}" tabindex="${p.id === 'bal' ? 0 : -1}"><span class="asx-ps-pi">${I(p.ic)}</span><b>${p.n}</b><span class="d">${p.d}</span><span class="asx-ps-m" aria-hidden="true">${[1, 2, 3].map(x => `<i class="${x <= p.m ? 'on' : ''}"></i>`).join('')}</span></button>`).join('');
    const cards = $$('.asx-ps-p', pre);
    let saved = null, busy = false;
    grid.innerHTML = ASX_TOOLS.map(t => `<div class="asx-ps-row" role="row"><span class="asx-ps-tl" role="rowheader">${asxApp(t)}<span>${t[1]}</span></span>${COLS.map((col, j) => `<button class="asx-ps-c" type="button" role="gridcell" data-t="${t[0]}" data-j="${j}" tabindex="-1"></button>`).join('')}</div>`).join('');
    const cells = $$('.asx-ps-c', grid); cells[0].tabIndex = 0;
    // a cell that changes pops in: a little spring in Soft, a cut in Blueprint
    const popIn = (el, d, bp) => { if (REDUCE || !el.animate) return; el.animate(bp ? [{ opacity:0 }, { opacity:1 }] : [{ transform:'scale(.8)', opacity:.3 }, { transform:'scale(1.06)', offset:.6 }, { transform:'none', opacity:1 }], { duration:bp ? 300 : 400, delay:d, easing:bp ? 'steps(2,end)' : 'cubic-bezier(.22,1,.36,1)', fill:'backwards' }); };
    let bpM = false;
    function cell(b, v, flip, d = 0){
      if (b.dataset.v === v) return; b.dataset.v = v; b.className = 'asx-ps-c ' + v; b.innerHTML = `${I(ICON[v],'xs')}<span class="lb">${NAME[v]}</span>`;
      const t = ASX_TOOLS.find(x => x[0] === b.dataset.t)[1]; b.setAttribute('aria-label', `${t}, ${COLS[b.dataset.j].toLowerCase()}: ${NAME[v]}. Press to change`);
      if (flip) popIn(b, d, bpM);
    }
    const snap = () => JSON.stringify(cells.map(b => b.dataset.v));
    function state(){
      const s = snap(), dirty = saved !== null && s !== saved;
      const match = PRE.findIndex(p => JSON.stringify(ASX_TOOLS.flatMap(t => p.g[t[0]].split(' '))) === s);
      cards.forEach((b, i) => { b.setAttribute('aria-checked', String(i === match)); b.tabIndex = i === (match < 0 ? 1 : match) ? 0 : -1; });
      if (!busy) bt.textContent = match >= 0 ? `${PRE[match].n} preset${dirty ? ', not saved' : ''}` : `Your own settings${dirty ? ', not saved' : ''}`;
      root.classList.toggle('dirty', dirty); sv.disabled = !dirty; rs.disabled = !dirty;
    }
    const motion = () => { bpM = getComputedStyle(root).getPropertyValue('--motion').trim() === 'bp'; };
    function apply(i, flip){ motion(); const p = PRE[i]; ASX_TOOLS.forEach((t, ti) => p.g[t[0]].split(' ').forEach((v, j) => cell(cells[ti * 3 + j], v, flip, (ti * 3 + j) * 22))); state(); }
    cards.forEach((b, i) => b.onclick = () => apply(i, true));
    c.on(pre, 'keydown', e => { const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (!d) return; e.preventDefault(); const i = Math.max(0, cards.indexOf(document.activeElement)); const j = (i + d + 3) % 3; apply(j, true); cards[j].focus(); });
    // a cell moves on when pressed; the arrow keys move round the grid
    cells.forEach(b => b.onclick = () => { motion(); cell(b, ORDER[(ORDER.indexOf(b.dataset.v) + 1) % 3], true); state(); });
    c.on(grid, 'keydown', e => { const i = cells.indexOf(document.activeElement); if (i < 0) return; const d = { ArrowRight:1, ArrowLeft:-1, ArrowDown:3, ArrowUp:-3 }[e.key]; if (!d) return; e.preventDefault(); const j = i + d; if (!cells[j]) return; cells.forEach(x => x.tabIndex = -1); cells[j].tabIndex = 0; cells[j].focus(); });
    // saving: a spinner, then Saved with a green tick in the bar for a moment
    sv.onclick = () => c.run(async () => {
      if (busy) return; busy = true; sv.innerHTML = '<span class="spin"></span>'; await c.wait(600);
      saved = snap(); sv.textContent = 'Save'; bt.innerHTML = `${I('check','xs')}<span>Saved</span>`; state();
      await c.wait(1200); busy = false; state();
    });
    rs.onclick = () => { motion(); const v = JSON.parse(saved); cells.forEach((b, i) => cell(b, v[i], true, i * 15)); state(); };
    apply(1, false); saved = snap(); state();
    c.story(async s => {
      await s.beat(3);
      await s.tap(cards[0]); s.away(); await s.beat(4);
      await s.tap(cards[2]); s.away(); await s.beat(4);
      await s.tap(cells[11]); s.away(); await s.beat(2);
      await s.tap(cells[11]); s.away(); await s.beat(3);
      await s.tap(sv); s.away(); await s.beat(4);
    });
  }
  // the switch under the settings (on designme.dev, the card's tabs) picks the design. A pick draws it in place and plays its
  // demo from the start, on a controller of its own inside the card's: a mouse on the component holds it, a click, a key or
  // the focus inside the design stops it for good, and the card keeps the pick when it plays again or is replayed
  function asxDesigns(r, c, D){
    const main = $('.dm-main', r), sg = $('.demo .seg2', r), card = c.card || r;
    let k = null, at = D[card._asxDesign] ? card._asxDesign : 'classic';
    const show = (v, fresh) => {
      if (k){ k.stop(); const i = c.kids.indexOf(k); if (i >= 0) c.kids.splice(i, 1); }
      const kk = k = ctl(c); kk.card = c.card; kk.st = c.st;
      Object.defineProperty(kk, 'held', { get:() => c.held });
      Object.defineProperty(kk, 'seen', { get:() => c.seen });
      const mine = e => { if (e.isTrusted) kk.mine = true; };
      ['pointerdown', 'keydown', 'input', 'click'].forEach(t => kk.on(main, t, mine, true));
      kk.on(main, 'focusin', e => { if (e.isTrusted && e.timeStamp - lastInput < 100) kk.mine = true; }, true);
      if (openPop && main.contains(openPop.pop)) closePops();
      // the pointer of the story that was playing goes with it
      hideTip(); $$(':scope>.hand', c.st).forEach(h => h.remove());
      main.innerHTML = D[v][0];
      try { D[v][1](main, kk); } catch(e){ console.error(e); }
      if (fresh) reveal(main);
    };
    c.offs.push(() => { if (k) k.stop(); });
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === at)));
    seg(sg, v => { if (v === at || !D[v]) return; at = card._asxDesign = v; show(v, true); });
    show(at, false);
  }
  DM.def('agent-settings', (r, c, card) => {
    // installed on its own (no switch), or inside another component, it is Classic
    const dm = $(':scope>.asx-dm', r);
    if (!dm) return classic(r, c, card);
    if (r !== c.st || !card){ dm.replaceWith(...$(':scope>.dm-main', dm).childNodes); return classic(r, c, card); }
    asxDesigns(r, c, { classic:[$(':scope>.dm-main', dm).innerHTML, classic], preview:[ASX_HTML.preview, asxPreview], tabs:[ASX_HTML.tabs, asxTabs], presets:[ASX_HTML.presets, asxPresets] });
  });
}
/* ---------- File explorer ---------- */
DM.def('file-explorer', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{search}', I('search','xs')).replace('{filter}', I('filter','xs'));
  const T = { n:'', k:[
    { n:'src', k:[
      { n:'components', k:[ { n:'PlanCard.tsx', s:'M' }, { n:'PriceTag.tsx', s:'A' }, { n:'Button.tsx' }, { n:'LegacyCTA.tsx', s:'D' } ] },
      { n:'styles', k:[ { n:'tokens.css', s:'M' }, { n:'globals.css' } ] },
      { n:'pages', k:[ { n:'pricing.mdx', s:'M' }, { n:'index.mdx' } ] }
    ]},
    { n:'public', k:[ { n:'og-pricing.png', s:'A' }, { n:'favicon.svg' } ] },
    { n:'package.json' }, { n:'README.md' }
  ]};
  const tree = $('.fxp-tree', r), inp = $('.fxp-s input', r), chB = $('.fxp-ch', r), st = $('.fxp-st', r);
  const open = new Set(['src','src/components','src/styles']); let only = false, sel = 'src/components/PlanCard.tsx';
  const changed = n => n.s || (n.k && n.k.some(changed));
  const match = (n, q) => !q || n.n.toLowerCase().includes(q) || (n.k && n.k.some(k => match(k, q)));
  const ext = n => /\.(tsx)$/.test(n) ? 'code' : /\.css$/.test(n) ? 'palette' : /\.png|\.svg$/.test(n) ? 'image' : 'file-text';
  function build(n, path, d, q){
    return n.k.filter(k => match(k, q) && (!only || changed(k))).map(k => {
      const p = path ? path + '/' + k.n : k.n, isD = !!k.k, op = isD && (open.has(p) || !!q || only);
      return `<button class="fxp-n${isD && op ? ' open' : ''}${p === sel ? ' sel' : ''}${k.s ? ' ' + k.s : ''}" data-p="${p}" ${isD ? 'data-d="1"' : ''} style="padding-left:${6 + d * 14}px" role="treeitem"><span class="cv">${isD ? I('chev-r','xs') : ''}</span><span class="ic">${I(isD ? 'folder' : ext(k.n),'xs')}</span><span class="nm">${k.n}</span>${k.s ? `<span class="bd ${k.s}">${k.s}</span>` : isD && changed(k) ? '<span class="ag"></span>' : ''}</button>` + (isD ? `<div class="fxp-k${op ? '' : ' shut'}"><div>${build(k, p, d + 1, q)}</div></div>` : '');
    }).join('');
  }
  function paint(){
    tree.innerHTML = build(T, '', 0, inp.value.trim().toLowerCase());
    $$('.fxp-n', tree).forEach(b => b.onclick = () => {
      if (b.dataset.d){ const p = b.dataset.p, k = b.nextElementSibling; const o = !open.has(p); o ? open.add(p) : open.delete(p); b.classList.toggle('open', o); k.classList.toggle('shut', !o); }
      else { sel = b.dataset.p; $$('.fxp-n', tree).forEach(x => x.classList.toggle('sel', x === b)); swap(st, sel); }
    });
  }
  inp.oninput = paint;
  chB.onclick = () => { only = !only; chB.classList.toggle('on', only); swap(st, only ? '6 files changed by the agent' : sel); paint(); stagger($$('.fxp-n', tree), 25); };
  st.textContent = sel; paint(); stagger($$('.fxp-n', tree), 25);
});
/* ---------- Automation canvas ---------- */
DM.def('automation-canvas', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{play}', I('play','xs')).replace('{search}', I('search','xs')).replace(/\{(minus|plus|fit)\}/g, (m, n) => I(n));
  // sub: the connectors under a step, for the model it thinks with and the tools it may use
  const N = [
    { id:'t', ic:'clock', col:'var(--py)', t:'Schedule', d:'Mondays 9:00', y:.4, f:['When', ['Mondays 9:00','Every weekday','On new Figma version']] },
    { id:'a', ic:'figma', col:'var(--pl)', t:'Read frames', d:'Pricing, Checkout', y:.22, f:['Frames', ['Pricing, Checkout','All frames','Changed this week']] },
    { id:'b', ic:'spark', col:'var(--accent-mark,var(--accent))', fg:'var(--accent-fg,var(--accent))', t:'Agent: audit', d:'Contrast, tokens', y:.58, f:['Checks', ['Contrast, tokens','Everything','Accessibility only']], sub:['model', 'tools'] },
    { id:'c', ic:'send', col:'var(--pm)', t:'Post summary', d:'#design in Slack', y:.4, f:['Channel', ['#design in Slack','Email the team','Linear ticket']] }
  ];
  // a wire: from, to, and for a model or a tool, which connector it hangs from
  const E = [['t','a'],['t','b'],['a','c'],['b','c']];
  // the steps the picker offers: a + after a step offers tools, logic and actions; a connector offers its own group
  const CAT = [
    { id:'tools', label:'Tools', col:'var(--pt)', items:[
      { ic:'globe', t:'Search the web', desc:'Looks things up and keeps the top results', f:['Sources', ['Top results','News only','Our docs site']] },
      { ic:'file-text', t:'Read a doc', desc:'Pulls the text out of a doc or a PDF', f:['Doc', ['Brand guidelines','Release notes','Any shared doc']] },
      { ic:'eye', t:'Check contrast', desc:'Measures each text colour against its fill', f:['Level', ['WCAG AA','WCAG AAA','APCA']] } ] },
    { id:'logic', label:'Logic', col:'var(--py)', items:[
      { ic:'branch', t:'If / else', desc:'Sends the run one way or the other', f:['When', ['Any check fails','Over 5 issues','Always']] },
      { ic:'clock', t:'Wait', desc:'Pauses the run for a while', f:['For', ['1 hour','Until 9:00','1 day']] },
      { ic:'user', t:'Ask a person', desc:'Holds the run until someone approves', f:['Who', ['Design lead','Anyone on #design','The run owner']] } ] },
    { id:'actions', label:'Actions', col:'var(--pm)', items:[
      { ic:'flag', t:'Create ticket', desc:'Files an issue with what the agent found', f:['Tracker', ['Design QA board','Linear, Web team','GitHub issues']] },
      { ic:'mail', t:'Send email', desc:'Emails a short summary to a list', f:['To', ['Design team','Product leads','Just me']] },
      { ic:'edit', t:'Update doc', desc:'Writes the results into a shared doc', f:['Doc', ['QA log','Weekly notes','Release checklist']] } ] },
    { id:'models', label:'Models', col:'var(--pl)', items:[
      { ic:'bolt', t:'Fast model', desc:'Quick and cheap, for simple checks', f:['Model', ['Fast','Fast, low cost']] },
      { ic:'brain', t:'Reasoning model', desc:'Slower, thinks harder audits through', f:['Model', ['Reasoning','Reasoning, long context']] },
      { ic:'image', t:'Vision model', desc:'Reads screenshots and frames', f:['Model', ['Vision','Vision, high detail']] } ] }
  ];
  const OFFER = { out:['tools', 'logic', 'actions'], model:['models'], tools:['tools'] }, KIND = { model:'Model', tools:'Tools' };
  // the canvas holds this many steps (fewer when it stacks on a phone); after that the + handles go
  const MAX = () => narrow() ? 6 : 9;
  const cv = $('.acx-cv', r), svg = $('.acx-svg', r), nodes = $('.acx-nodes', r), pop = $('.acx-pop', r), st = $('.acx-st', r), live = $('.acx-live', r);
  const pk = $('.acx-pk', r), qi = $('.acx-qi', r), ls = $('.acx-ls', r), pd = $('.acx-pd', r);
  const vp = $('.acx-vp', r), world = $('.acx-world', r), mq = $('.acx-mq', r), zm = $('.acx-zm', r), zl = $('.acx-zl', r), zo = $('.acx-zo', r), zi = $('.acx-zi', r), fitB = $('.acx-fit', r), sr = $('.acx-sr', r);
  const say = t => { live.textContent = t; };
  const narrow = () => cv.clientWidth < 560;
  // the name over the top of the canvas and Test run over its foot: the steps are laid out, fitted and placed in the band
  // between them (T from the top, B from the bottom), so neither covers a step at rest
  const tp = $('.acx-top', r), bar = $('.acx-bar', r);
  const safe = () => ({ T:tp.offsetTop + tp.offsetHeight - cv.offsetTop + 8, B:cv.clientHeight - bar.offsetTop + 8 });
  const band = y => { const H = cv.clientHeight, { T, B } = safe(); return (T + y * Math.max(0, H - T - B)) / H; };
  // wide: the trigger and the last step sit the same distance in from each side and the two middle steps halfway between,
  // so the wires on the left and right are the same length at any width. A step you dragged keeps where you put it
  const wide = (n, W, w) => { const pad = Math.max(20, W * .06); return { x:{ t:pad + w / 2, a:W / 2, b:W / 2, c:W - pad - w / 2 }[n.id] / W, y:band(n.y) }; };
  // narrow: the steps go down the left of the canvas, with the agent on its own on the right, so its model and tools have
  // room under it
  const NARROWAT = { t:['l', .07], a:['l', .2], b:['r', .33], c:['l', .64] };
  const pos = (n, W, w) => (narrow() ? n.um : n.uw) || (n.add ? null : narrow() ? { x:(NARROWAT[n.id][0] === 'l' ? 6 + w / 2 : W - 6 - w / 2) / W, y:band(NARROWAT[n.id][1]) } : wide(n, W, w));
  const nodeHTML = n => `<button class="acx-n${n.kind ? ' sm' : ''}" data-id="${n.id}"><span class="ic" style="color:${n.fg || n.col};background:color-mix(in srgb,${n.col} 14%,transparent)">${I(n.ic,'xs')}</span><span class="t"><b>${n.t}</b><span class="d">${n.d}</span></span></button>`;
  nodes.innerHTML = N.map(nodeHTML).join('');
  const el = id => $(`.acx-n[data-id="${id}"]`, nodes);
  const byId = id => N.find(n => n.id === id);
  const box = b => ({ l:b.offsetLeft, t:b.offsetTop, r:b.offsetLeft + b.offsetWidth, b:b.offsetTop + b.offsetHeight, w:b.offsetWidth, h:b.offsetHeight });

  /* ---------- the view, as in Canvas toolbar: zoom z and pan (px, py), so a point x on the board shows at x * z + px. The
     steps are laid out on the board as before (at rest the view shows it whole, at 100%); the popover and the picker are
     placed where their step shows ---------- */
  const Z = [.5, .67, .75, .9, 1, 1.25, 1.5, 2], ZMIN = Z[0], ZMAX = Z[Z.length - 1];
  let z = 1, px = 0, py = 0, lastT = '';
  const lim = v => Math.max(ZMIN, Math.min(ZMAX, v)), pct = () => Math.round(z * 100) + '%';
  const scr = B => ({ l:B.l * z + px, t:B.t * z + py, r:B.r * z + px, b:B.b * z + py, w:B.w * z, h:B.h * z });
  function apply(anim){
    const W = cv.clientWidth, H = cv.clientHeight;
    // the board never goes more than half the canvas off, so the middle of the canvas always shows some of it
    px = Math.round(Math.max(W / 2 - W * z, Math.min(W / 2, px)) * 100) / 100; py = Math.round(Math.max(H / 2 - H * z, Math.min(H / 2, py)) * 100) / 100;
    const t = `translate(${px}px,${py}px) scale(${z})`;
    if (t !== lastT){
      // what the popover and the picker point at has moved
      if (lastT){ close(); closePk(); }
      lastT = t; cv.classList.toggle('anim', !!anim && !REDUCE); world.style.transform = t;
    }
    // the dots move and scale with the board
    const g = 16 * z; cv.style.backgroundSize = `${g}px ${g}px`; cv.style.backgroundPosition = `${(W - 16) / 2 * z + px}px ${(H - 16) / 2 * z + py}px`;
    zl.textContent = pct(); zl.setAttribute('aria-label', `Zoom ${pct()}, reset to 100%`);
    zo.setAttribute('aria-disabled', z <= ZMIN + 1e-3); zi.setAttribute('aria-disabled', z >= ZMAX - 1e-3);
  }
  function zoomAt(nz, x, y, anim){ nz = lim(nz); const wx = (x - px) / z, wy = (y - py) / z; z = nz; px = x - wx * z; py = y - wy * z; apply(anim); }
  const zstep = d => { const s2 = d > 0 ? Z.find(x => x > z + 1e-3) : [...Z].reverse().find(x => x < z - 1e-3); return s2 === undefined ? z : s2; };
  function zoomBy(d){ const nz = zstep(d); if (nz === z) return; zoomAt(nz, cv.clientWidth / 2, cv.clientHeight / 2, true); say('Zoom ' + pct()); }
  function zoomReset(){ zoomAt(1, cv.clientWidth / 2, cv.clientHeight / 2, true); say('Zoom 100%'); }
  // fit: every step and its + in view, centred in the band between the name and Test run, never past 100%
  function fit(){
    const W = cv.clientWidth, { T, B } = safe(), H = cv.clientHeight - T - B, P = 24, bs = $$('.acx-n, .acx-h, .acx-sc', nodes).filter(b => b.dataset.on !== '0').map(box);
    if (!bs.length) return;
    const x0 = Math.min(...bs.map(b => b.l)), y0 = Math.min(...bs.map(b => b.t)), x1 = Math.max(...bs.map(b => b.r)), y1 = Math.max(...bs.map(b => b.b));
    z = lim(Math.min((W - 2 * P) / (x1 - x0), (H - 2 * P) / (y1 - y0), 1));
    px = (W - (x1 - x0) * z) / 2 - x0 * z; py = T + (H - (y1 - y0) * z) / 2 - y0 * z;
    apply(true); say('Fit to screen, ' + pct());
  }

  /* ---------- the + handles and the connectors ---------- */
  // a step's output is open when no step follows it; models and tools have no output of their own
  const open = n => !n.kind && !E.some(e => e[0] === n.id && !e[2]);
  const knobs = {};
  function syncKnobs(){
    const full = N.length >= MAX();
    N.forEach(n => {
      const want = [...(open(n) && !full ? ['out'] : []), ...(full ? [] : n.sub || [])];
      Object.keys(knobs).filter(k => k.startsWith(n.id + ':') && !want.includes(k.split(':')[1])).forEach(k => { knobs[k].remove(); delete knobs[k]; });
      want.forEach(kind => {
        const k = n.id + ':' + kind; if (knobs[k]) return;
        const b = kind === 'out'
          ? html(`<button class="acx-h" aria-haspopup="dialog" aria-expanded="false" aria-label="Add a step after ${n.t}" data-tip="Add a step">${I('plus','xs')}</button>`)
          : html(`<button class="acx-sc" aria-haspopup="dialog" aria-expanded="false" aria-label="Add ${kind === 'model' ? 'a model' : 'a tool'} to ${n.t}">${I('plus','xs')}<span>${KIND[kind]}</span></button>`);
        b.dataset.for = n.id; b.dataset.k = kind; nodes.appendChild(b); knobs[k] = b;
        b.onclick = e => { e.stopPropagation(); pk.classList.contains('open') && pkFor === b ? closePk(true) : openPk(b, e.isTrusted); };
      });
    });
  }
  // where a step's output leaves it: its right side, or its foot when the canvas stacks. There the agent's wire to a step
  // on its left leaves from its left side, so it keeps clear of the model and tools under it
  // On a wide canvas a step with no room for another to its right (the last one, near the edge) takes its + under it, and
  // the steps added there stack downwards
  const roomR = B => B.r + 56 + (cv.clientWidth < 700 ? 150 : 176) + 40 <= cv.clientWidth;
  const outAt = (B, n, T) => !narrow() ? ((T ? T.l >= B.r + 8 : roomR(B)) ? { x:B.r, y:B.t + B.h / 2, d:'r' } : { x:B.l + B.w / 2, y:B.b, d:'d' })
    : n && n.sub && T && T.l + T.w / 2 < B.l ? { x:B.l, y:B.t + B.h / 2, d:'l' } : { x:B.l + B.w / 2, y:B.b, d:'d' };
  // the connectors sit under the step, either side of the middle so a wire leaving its foot passes between them
  function subAt(n, kind){
    const B = box(el(n.id)), cx = B.l + B.w / 2, g = narrow() ? 24 : 8, kinds = n.sub || [];
    const wOf = k => (knobs[n.id + ':' + k] || {}).offsetWidth || 64;
    const one = kinds.length < 2, l = one ? cx - wOf(kind) / 2 : kind === kinds[0] ? cx - g / 2 - wOf(kind) : cx + g / 2;
    return { l, t:B.b + 10, w:wOf(kind), h:24 };
  }
  function placeKnobs(){
    Object.entries(knobs).forEach(([k, b]) => {
      const [id, kind] = k.split(':'), n = byId(id), B = box(el(id));
      if (kind === 'out'){ const o = outAt(B); b.style.left = (o.d === 'r' ? o.x + 10 : o.x - 10) + 'px'; b.style.top = (o.d === 'r' ? o.y - 10 : o.y + 10) + 'px'; }
      else { const s = subAt(n, kind); b.style.left = s.l + 'px'; b.style.top = s.t + 'px'; }
    });
  }

  /* ---------- wires: from a step's output, or a connector's foot, into the side of the next step that faces it ---------- */
  function link(a, B){
    let p, e;
    if (a.d === 'l'){ if (B.t >= a.y + 8){ p = [B.l + B.w / 2, B.t]; e = 't'; } else if (B.r <= a.x - 8){ p = [B.r, B.t + B.h / 2]; e = 'r'; } else { p = [B.l + B.w / 2, B.b]; e = 'b'; } }
    else if (a.d === 'r'){ if (B.l >= a.x + 8){ p = [B.l, B.t + B.h / 2]; e = 'l'; } else if (B.t >= a.y){ p = [B.l + B.w / 2, B.t]; e = 't'; } else { p = [B.l + B.w / 2, B.b]; e = 'b'; } }
    else { if (B.t >= a.y + 8){ p = [B.l + B.w / 2, B.t]; e = 't'; } else if (B.l >= a.x){ p = [B.l, B.t + B.h / 2]; e = 'l'; } else { p = [B.r, B.t + B.h / 2]; e = 'r'; } }
    const dx = p[0] - a.x, dy = p[1] - a.y, k0 = Math.max(24, Math.abs(a.d === 'd' ? dy : dx) / 2), k1 = Math.max(24, Math.abs('lr'.includes(e) ? dx : dy) / 2);
    const c1 = a.d === 'r' ? [a.x + k0, a.y] : a.d === 'l' ? [a.x - k0, a.y] : [a.x, a.y + k0], c2 = { l:[p[0] - k1, p[1]], r:[p[0] + k1, p[1]], t:[p[0], p[1] - k1], b:[p[0], p[1] + k1] }[e];
    return [[a.x, a.y], c1, c2, p];
  }
  const bez = (q, t) => { const u = 1 - t; return [0, 1].map(i => u * u * u * q[0][i] + 3 * u * u * t * q[1][i] + 3 * u * t * t * q[2][i] + t * t * t * q[3][i]); };
  const dOf = q => `M${q[0].join(' ')} C${q[1].join(' ')} ${q[2].join(' ')} ${q[3].join(' ')}`;
  const anchorOf = ([a, b, kind]) => { if (kind){ const s = subAt(byId(a), kind); return { x:s.l + s.w / 2, y:s.t + s.h, d:'d' }; } return outAt(box(el(a)), byId(a), box(el(b))); };
  const placed = n => !!el(n.id) && el(n.id).dataset.on !== '0';
  // the wires are made once and only reshaped after that, so a resize or a drag never restarts their draw or their light
  const wireEl = {}, key = (a, b) => a + '>' + b, geo = {};
  function wires(){
    E.forEach(e => {
      const [a, b, kind] = e; if (!placed(byId(a)) || !placed(byId(b))) return;
      const q = geo[key(a, b)] = link(anchorOf(e), box(el(b)));
      let p = wireEl[key(a, b)]; if (!p){ p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.dataset.e = key(a, b); if (kind) p.classList.add('sub'); svg.appendChild(p); wireEl[key(a, b)] = p; }
      p.setAttribute('d', dOf(q));
      if (svg.classList.contains('intro') && !p.style.getPropertyValue('--l')) p.style.setProperty('--l', Math.ceil(p.getTotalLength()));
    });
    // the short stubs from a step to its + and its connectors
    const want = new Set();
    Object.entries(knobs).forEach(([k, b]) => {
      const [id, kind] = k.split(':'), B = box(el(id)); let d;
      if (kind === 'out'){ const o = outAt(B); d = o.d === 'r' ? `M${o.x} ${o.y}H${o.x + 10}` : `M${o.x} ${o.y}V${o.y + 10}`; }
      else { const s = subAt(byId(id), kind), x = s.l + s.w / 2; d = `M${x} ${B.b}V${s.t}`; }
      want.add(k); let p = wireEl['s:' + k]; if (!p){ p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('class', 'stub'); svg.appendChild(p); wireEl['s:' + k] = p; }
      p.setAttribute('d', d);
    });
    Object.keys(wireEl).filter(k => k.startsWith('s:') && !want.has(k.slice(2))).forEach(k => { wireEl[k].remove(); delete wireEl[k]; });
    placeKnobs();
  }

  /* ---------- where a new step goes: as near as it can to just after what it hangs from (to the right of a step, under a
     connector, or under a step when the canvas stacks), clear of every step, + and connector with room to spare, keeping off
     the wires already drawn, with its own wire crossing no step, and with room for its own + inside the canvas ---------- */
  function spot(n){
    const W = cv.clientWidth, H = cv.clientHeight, me = el(n.id), w = me.offsetWidth, h = me.offsetHeight, M = 8;
    const e = E.find(x => x[1] === n.id), src = e[0], a = e[2] ? anchorOf(e) : outAt(box(el(src)), byId(src));
    const others = N.filter(x => x !== n && placed(x)).map(x => box(el(x.id)));
    const ks = Object.entries(knobs).filter(([k]) => { const id = k.split(':')[0]; return k !== src + ':out' && id !== n.id && placed(byId(id)); }).map(([, b]) => box(b));
    // and clear of the zoom control in the corner, where it sits on the board in the current view
    const Z0 = { l:(zm.offsetLeft - px) / z, t:(zm.offsetTop - py) / z, w:zm.offsetWidth / z, h:zm.offsetHeight / z }; Z0.r = Z0.l + Z0.w; Z0.b = Z0.t + Z0.h;
    // and clear of the name over the top and Test run over the foot, wherever they sit on the board in the current view
    const { T:sT, B:sB } = safe(), onBoard = (l, t, r2, b2) => ({ l:(l - px) / z, t:(t - py) / z, r:(r2 - px) / z, b:(b2 - py) / z });
    const obst = [...others, ...ks, Z0, onBoard(0, 0, tp.offsetLeft + tp.offsetWidth + 8, sT), onBoard(0, cv.clientHeight - sB, bar.offsetLeft + bar.offsetWidth + 8, cv.clientHeight)];
    const samples = Object.entries(geo).filter(([k]) => !k.split('>').includes(n.id)).flatMap(([, q]) => Array.from({ length:15 }, (_, i) => bez(q, (i + 1) / 16)));
    const want = a.d === 'r' ? [a.x + 56 + w / 2, a.y] : [a.x, a.y + 40 + h / 2];
    const inside = (p, b, m) => p[0] > b.l - m && p[0] < b.r + m && p[1] > b.t - m && p[1] < b.b + m;
    const ov = (A, B, m) => Math.max(0, Math.min(A.r, B.r + m) - Math.max(A.l, B.l - m)) * Math.max(0, Math.min(A.b, B.b + m) - Math.max(A.t, B.t - m));
    let best = null, bs = Infinity, soft = null, ss = Infinity;
    // room to spare first; on a crowded canvas, just clear of the rest
    for (const G of [14, 4]){ if (best) break;
    for (let y = M; y + h <= H - M; y += 8) for (let x = M; x + w <= W - M; x += 8){
      const B = { l:x, t:y, r:x + w, b:y + h, w, h };
      if (!n.kind && (narrow() ? B.b + 34 > H - 4 : B.r + 34 > W - 4)) continue;
      let sc = Math.hypot(x + w / 2 - want[0], y + h / 2 - want[1]);
      if (a.d === 'r' ? B.l < a.x + 24 : B.t < a.y + 24) sc += 250;
      sc += samples.filter(p => inside(p, B, 6)).length * 60;
      const q = link(a, B); for (let i = 1; i < 12; i++){ const p = bez(q, i / 12); if (others.some(o => inside(p, o, 4))) sc += 30; }
      const hit = obst.reduce((s2, o) => s2 + ov(B, o, G), 0);
      if (!hit){ if (sc < bs){ bs = sc; best = B; } }
      else if (hit * 10 + sc < ss){ ss = hit * 10 + sc; soft = B; }
    } }
    const B = best || soft || { l:M, t:M, w, h };
    return { x:(B.l + w / 2) / W, y:(B.t + h / 2) / H };
  }
  function layout(){
    const W = cv.clientWidth, H = cv.clientHeight, small = narrow() || W < 700;
    // a model or a tool is a smaller step, so on a stacked canvas it fits beside the steps in the left-hand column
    $$('.acx-n', nodes).forEach(b => b.style.width = b.classList.contains('sm') ? (narrow() ? '124px' : small ? '150px' : '') : small ? '150px' : '');
    syncKnobs(); Object.keys(geo).forEach(k => delete geo[k]);
    const put = (n, p) => { const b = el(n.id); b.style.left = (p.x * W - b.offsetWidth / 2) + 'px'; b.style.top = (p.y * H - b.offsetHeight / 2) + 'px'; b.dataset.on = '1'; };
    // the steps with a place first, then each added one that has none in this layout yet, in the order they were added
    N.forEach(n => { const p = pos(n, W, el(n.id).offsetWidth); if (p) put(n, p); else el(n.id).dataset.on = '0'; });
    N.filter(n => el(n.id).dataset.on === '0').forEach(n => { wires(); const p = spot(n); if (narrow()) n.um = p; else n.uw = p; put(n, p); });
    wires();
  }
  let selN = null;
  // a step's settings open as a small dialog beside it. Opened with the keyboard, the focus goes into it; Escape or Done
  // closes it and gives the focus back to the step. Its field is a menu button: the arrows move through the choices and wrap,
  // Home and End jump, Enter or Space picks, and Escape closes the list back to the field
  const uid = Math.random().toString(36).slice(2, 7);
  function config(n, key){
    closePk();
    const b = el(n.id); selN = n;
    pop.innerHTML = `<h4 id="acx-h-${n.id}-${uid}">${n.t}</h4><div class="acx-fl"><span id="acx-f-${n.id}-${uid}">${n.f[0]}</span><button class="acx-dd" aria-haspopup="menu" aria-expanded="false" aria-labelledby="acx-f-${n.id}-${uid} acx-v-${n.id}-${uid}"><span id="acx-v-${n.id}-${uid}">${n.d}</span>${I('chev-d','xs')}</button><div class="acx-opts" role="menu" aria-labelledby="acx-f-${n.id}-${uid}">${n.f[1].map(o => `<button class="mi" role="menuitemradio" tabindex="-1" aria-checked="${o === n.d}"><span>${o}</span><span class="ck">${I('check','xs')}</span></button>`).join('')}</div></div><button class="pill soft sm acx-done">Done</button>`;
    pop.setAttribute('aria-labelledby', `acx-h-${n.id}-${uid}`);
    // beside the step, or under or over it: whichever spot covers the least of the other steps (and none of this one),
    // nearest the step when spots tie, so the popover never hides the step a run flows on to. The canvas fills the
    // component, so it stays inside it
    const W = cv.clientWidth, H = cv.clientHeight, pw = pop.offsetWidth || 240, ph = pop.offsetHeight || 150, G = 10, M = 6, OVER = 0;
    const me = scr(box(b)), others = $$('.acx-n', nodes).filter(x => x !== b).map(x => scr(box(x)));
    const cx = (me.l + me.r) / 2, cy = (me.t + me.b) / 2, cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const over = (x, y, o) => Math.max(0, Math.min(x + pw, o.r) - Math.max(x, o.l)) * Math.max(0, Math.min(y + ph, o.b) - Math.max(y, o.t));
    const ys = [me.t - 40, cy - ph / 2, me.t, me.b - ph, M, H - ph - M, H - ph + OVER], xs = [cx - pw / 2, me.l, me.r - pw, M, W - pw - M];
    const spots = [...ys.map(y => [me.r + G, y]), ...ys.map(y => [me.l - pw - G, y]), ...xs.map(x => [x, me.b + G]), ...xs.map(x => [x, me.t - ph - G])]
      .flatMap(([x, y]) => [[cl(x, M, W - pw - M), cl(y, M, H - ph - M)], [cl(x, M, W - pw - M), cl(y, M, H - ph + OVER)]]);
    let best = null, bs = Infinity;
    for (const [x, y] of spots){ const hang = Math.max(0, y + ph - (H - M)); const sc = others.reduce((a, o) => a + over(x, y, o), 0) + over(x, y, me) * 4 + hang * 20 + Math.hypot(x + pw / 2 - cx, y + ph / 2 - cy) / 100; if (sc < bs){ bs = sc; best = [x, y]; } }
    pop.style.left = best[0] + 'px'; pop.style.top = best[1] + 'px'; pop.style.position = 'absolute'; pop.classList.add('open'); pop.inert = false;
    const dd = $('.acx-dd', pop), ops = $('.acx-opts', pop), mis = $$('.mi', ops);
    const top0 = best[1];
    const fit = () => { pop.style.top = Math.max(M, Math.min(top0, H + OVER - pop.offsetHeight)) + 'px'; };
    const list = (on, focus) => { ops.classList.toggle('open', on); dd.setAttribute('aria-expanded', on); fit();
      if (on && focus){ const m = focus === 'last' ? mis[mis.length - 1] : mis.find(x => x.getAttribute('aria-checked') === 'true') || mis[0]; m.focus({ preventScroll:true }); }
      if (!on && ops.contains(document.activeElement)) dd.focus({ preventScroll:true }); };
    dd.onclick = e => { e.stopPropagation(); list(!ops.classList.contains('open'), e.isTrusted && !e.detail && 'first'); };
    dd.onkeydown = e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); list(true, e.key === 'ArrowUp' ? 'last' : 'first'); } };
    ops.onkeydown = e => { const i = mis.indexOf(document.activeElement), go = { ArrowDown:mis[(i + 1) % mis.length], ArrowUp:mis[(i - 1 + mis.length) % mis.length], Home:mis[0], End:mis[mis.length - 1] }[e.key];
      if (go){ e.preventDefault(); go.focus({ preventScroll:true }); } else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); list(false); } else if (e.key === 'Tab') list(false); };
    mis.forEach(m => m.onclick = e => { e.stopPropagation(); n.d = $('span', m).textContent; swap($('.d', b), n.d); swap($('span', dd), n.d); mis.forEach(x => x.setAttribute('aria-checked', x === m)); list(false); if (n.id === 't') swap(st, n.d.replace('Mondays', 'Every Monday,')); });
    $('.acx-done', pop).onclick = () => close(true);
    if (key) dd.focus({ preventScroll:true });
  }
  function close(back){ const b = selN && el(selN.id), was = pop.contains(document.activeElement); pop.classList.remove('open'); pop.inert = true; selN = null; if (b && (back || was)) b.focus({ preventScroll:true }); }
  pop.inert = true;
  c.on(pop, 'keydown', e => { if (e.key === 'Escape' && selN){ e.preventDefault(); close(true); } });
  /* ---------- selection: a click selects a step (and opens its setting), Shift and a click adds it to the selection or takes
     it out, and a click on the empty canvas or Escape clears it. Dragging a selected step moves every selected step ---------- */
  let sel = new Set();
  function select(ids){ sel = new Set(ids); N.forEach(n => { const b = el(n.id); if (b) b.classList.toggle('sel', sel.has(n.id)); }); }
  const picked = () => say(sel.size ? `${sel.size} of ${N.length} steps selected` : 'Nothing selected');
  let justDragged = false;
  function bind(n){
    const b = el(n.id);
    b.onclick = e => { e.stopPropagation(); if (justDragged){ justDragged = false; return; }
      if (e.shiftKey){ const s2 = new Set(sel); s2.has(n.id) ? s2.delete(n.id) : s2.add(n.id); select(s2); close(); closePk(); picked(); return; }
      select([n.id]); selN === n ? close() : config(n, e.isTrusted && !e.detail); };
    b.onkeydown = e => { if (e.key === 'Escape' && selN === n){ e.preventDefault(); close(); } };
    b.onpointerdown = e => {
      // a finger on a step of a canvas not yet engaged may be scrolling the page: it only taps
      if (e.button || (e.pointerType === 'touch' && !engaged)) return; const sx = e.clientX, sy = e.clientY; let moved = false, group = [];
      const mv = ev => { const dx = (ev.clientX - sx) / z, dy = (ev.clientY - sy) / z;
        if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 4) return;
        if (!moved){ moved = true; if (!sel.has(n.id)) select([n.id]);
          group = N.filter(x => sel.has(x.id) && el(x.id)).map(x => { const e2 = el(x.id); return [x, e2, e2.offsetLeft, e2.offsetTop]; });
          group.forEach(g => g[1].classList.add('drag')); nodes.classList.add('drag'); close(); closePk(); b.setPointerCapture?.(e.pointerId); }
        const W = cv.clientWidth, H = cv.clientHeight;
        group.forEach(([, e2, ox, oy]) => { e2.style.left = Math.max(4, Math.min(W - e2.offsetWidth - 4, ox + dx)) + 'px'; e2.style.top = Math.max(4, Math.min(H - e2.offsetHeight - 4, oy + dy)) + 'px'; });
        wires(); };
      const up = () => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up);
        if (!moved) return; nodes.classList.remove('drag'); justDragged = true; setTimeout(() => justDragged = false, 50);
        group.forEach(([x, e2]) => { e2.classList.remove('drag'); const f = { x:(e2.offsetLeft + e2.offsetWidth / 2) / cv.clientWidth, y:(e2.offsetTop + e2.offsetHeight / 2) / cv.clientHeight }; if (narrow()) x.um = f; else x.uw = f; }); };
      document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up);
      c.offs.push(() => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); });
    };
  }
  N.forEach(bind);
  c.on(cv, 'click', e => { if (!pop.contains(e.target) && !pk.contains(e.target)){ close(); closePk(); } });
  pop.onclick = e => e.stopPropagation();

  /* ---------- the step picker: a search (a combobox) over a listbox of step types in groups. The arrows move through it and
     wrap while the focus stays in the search, Enter adds the step, Escape closes it and gives the focus back to the + ---------- */
  let pkFor = null, act = -1, opts = [];
  ls.id = 'acx-ls-' + uid; qi.setAttribute('aria-controls', ls.id); pk.inert = true;
  const esc = t => t.replace(/[&<>"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[ch]);
  function paint(){
    const q = qi.value.trim().toLowerCase(), kind = pkFor.dataset.k;
    const groups = CAT.filter(g => OFFER[kind].includes(g.id)).map(g => ({ g, items:g.items.filter(it => !q || it.t.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)) })).filter(x => x.items.length);
    const mark = t => { const i = q ? t.toLowerCase().indexOf(q) : -1; return i < 0 ? esc(t) : esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + q.length)) + '</mark>' + esc(t.slice(i + q.length)); };
    let k = 0;
    ls.innerHTML = groups.length ? groups.map(({ g, items }) => `<div role="group" aria-labelledby="acx-g-${g.id}-${uid}"><div class="acx-gh" id="acx-g-${g.id}-${uid}">${g.label}</div>${items.map(it => { const i = k++; return `<div class="acx-o" role="option" aria-selected="false" id="acx-o-${uid}-${i}" aria-describedby="acx-od-${uid}-${i}" data-g="${g.id}" data-t="${esc(it.t)}"><span class="ic" style="color:${g.col};background:color-mix(in srgb,${g.col} 14%,transparent)">${I(it.ic,'xs')}</span><span>${mark(it.t)}</span><span id="acx-od-${uid}-${i}" hidden>${esc(it.desc)}</span></div>`; }).join('')}</div>`).join('')
      : `<p class="acx-pe">No steps match “${esc(qi.value.trim())}”</p>`;
    opts = $$('.acx-o', ls);
    opts.forEach((o, i) => { o.onpointermove = () => { if (act !== i) hl(i, false); }; o.onclick = e => { e.stopPropagation(); add(o, e.isTrusted); }; });
    hl(opts.length ? 0 : -1, true);
  }
  const itemOf = o => CAT.find(g => g.id === o.dataset.g).items.find(it => it.t === o.dataset.t);
  function hl(i, scroll){
    act = i; opts.forEach((o, j) => { o.classList.toggle('on', j === i); o.setAttribute('aria-selected', j === i); });
    const o = opts[i]; qi.setAttribute('aria-activedescendant', o ? o.id : '');
    pd.textContent = o ? itemOf(o).desc : 'Try another word';
    if (o && scroll){ const t = o.offsetTop - ls.offsetTop, b2 = t + o.offsetHeight; if (t < ls.scrollTop) ls.scrollTop = t - 24; else if (b2 > ls.scrollTop + ls.clientHeight) ls.scrollTop = b2 - ls.clientHeight; }
  }
  // beside the + : to its right, under it, or to the side of its step, whichever covers the least of the steps (and none
  // of the one it adds to), nearest the + when spots tie, always inside the canvas
  function openPk(b, focus){
    close(); if (pkFor && pkFor !== b) pkFor.setAttribute('aria-expanded', 'false');
    pkFor = b; b.setAttribute('aria-expanded', 'true'); qi.value = ''; ls.scrollTop = 0; paint();
    const src = byId(b.dataset.for), kind = b.dataset.k;
    pk.setAttribute('aria-label', kind === 'out' ? `Add a step after ${src.t}` : `Add ${kind === 'model' ? 'a model' : 'a tool'} to ${src.t}`);
    const W = cv.clientWidth, H = cv.clientHeight, pw = pk.offsetWidth, ph = pk.offsetHeight, K = scr(box(b)), S = scr(box(el(src.id))), M = 6, G = 8, OVER = -M;
    const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v)), kx = K.l + K.w / 2, ky = K.t + K.h / 2;
    const over = (x, y, o) => Math.max(0, Math.min(x + pw, o.r) - Math.max(x, o.l)) * Math.max(0, Math.min(y + ph, o.b) - Math.max(y, o.t));
    const others = N.filter(n => n !== src && placed(n)).map(n => scr(box(el(n.id))));
    const ys = [ky - 40, K.t, K.b - ph, M, H - ph - M, H - ph + OVER], xs = [kx - pw / 2, K.l, K.r - pw, S.l, S.r - pw, M, W - pw - M];
    const spots = [...ys.map(y => [K.r + G, y]), ...ys.map(y => [Math.min(K.l, S.l) - pw - G, y]), ...xs.map(x => [x, Math.max(K.b, kind === 'out' && !narrow() ? S.b : K.b) + G]), ...xs.map(x => [x, Math.min(K.t, S.t) - ph - G])]
      .map(([x, y]) => [cl(x, M, W - pw - M), cl(y, M, H - ph + OVER)]);
    let best = spots[0], bs = Infinity;
    for (const [x, y] of spots){ const sc = others.reduce((a, o) => a + over(x, y, o), 0) + (over(x, y, S) + over(x, y, K)) * 8 + Math.max(0, y + ph - (H - M)) * 20 + Math.hypot(x + pw / 2 - kx, y + ph / 2 - ky) / 100; if (sc < bs){ bs = sc; best = [x, y]; } }
    pk.style.left = best[0] + 'px'; pk.style.top = best[1] + 'px';
    pk.classList.add('open'); pk.inert = false;
    if (focus) qi.focus({ preventScroll:true });
  }
  function closePk(back){
    if (!pkFor) return; const b = pkFor, was = pk.contains(document.activeElement);
    pk.classList.remove('open'); pk.inert = true; b.setAttribute('aria-expanded', 'false'); pkFor = null;
    if (b.isConnected && (back || was)) b.focus({ preventScroll:true });
  }
  c.on(qi, 'input', paint);
  c.on(pk, 'keydown', e => {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp'){ e.preventDefault(); if (opts.length) hl((act + (k === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length, true); }
    else if (k === 'Enter'){ e.preventDefault(); if (opts[act]) add(opts[act], true); }
    else if (k === 'Escape'){ e.preventDefault(); e.stopPropagation(); closePk(true); }
    else if (k === 'Tab') closePk();
  });
  pk.onclick = e => e.stopPropagation();
  c.on(document, 'pointerdown', e => { if (pkFor && !pk.contains(e.target) && e.target !== pkFor && !pkFor.contains(e.target)) closePk(); });
  // picking one adds the step, wired from the + or connector it was opened from, and the focus moves on to it
  let seq = 0;
  function add(o, focus){
    const b = pkFor; if (!b) return;
    const it = itemOf(o), g = CAT.find(x => x.id === o.dataset.g), src = byId(b.dataset.for), kind = b.dataset.k === 'out' ? null : b.dataset.k;
    const n = { id:'n' + ++seq, ic:it.ic, col:g.col, t:it.t, d:it.f[1][0], f:it.f, add:true, kind };
    closePk(); N.push(n); E.push(kind ? [src.id, n.id, kind] : [src.id, n.id]);
    const nb = html(nodeHTML(n)); nb.classList.add('add'); nodes.insertBefore(nb, $('.acx-h, .acx-sc', nodes)); bind(n);
    layout();
    const p = wireEl[key(src.id, n.id)];
    if (p && !REDUCE){ p.style.setProperty('--l', Math.ceil(p.getTotalLength())); p.classList.add('new'); c.later(600, () => p.classList.remove('new')); }
    $$('.acx-h, .acx-sc', nodes).forEach(x => { if (!x.dataset.seen){ x.dataset.seen = 1; if (!x.isSameNode(b)) x.classList.add('in'); } });
    say(kind ? `${it.t} added to ${src.t}` : `${it.t} added after ${src.t}`);
    if (focus) nb.focus({ preventScroll:true });
  }

  /* ---------- moving around: drag the empty canvas (one finger on a touch screen) to pan, Shift and a drag to box-select,
     scroll or a trackpad to pan, Ctrl or ⌘ with the wheel or a pinch to zoom at the pointer; the corner buttons zoom and fit.
     A click on the empty canvas clears the selection ---------- */
  sr.id = 'acx-k-' + uid; cv.setAttribute('aria-describedby', sr.id);
  zo.onclick = () => zoomBy(-1); zi.onclick = () => zoomBy(1); zl.onclick = zoomReset; fitB.onclick = fit;
  const pt = e => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const touch = new Map(); let drag = null;
  const pinch = () => { const [a, b] = [...touch.values()]; return { d:Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, m:[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] }; };
  /* the canvas never traps the page: until the person has engaged with the component (a click in it, a tap in it, or the
     keyboard's focus coming into it) the wheel and touch belong to the page, so it scrolls past as usual. A finger that
     starts a scroll there is the page's; one that lifts without scrolling is a tap, which engages it. Once engaged
     (.engaged), one finger pans and two pinch, as the mouse does */
  let engaged = false, lastKey = -1e9;
  const engage = () => { if (engaged) return; engaged = true; cv.classList.add('engaged'); };
  c.on(document, 'keydown', e => { if (e.isTrusted) lastKey = e.timeStamp; }, true);
  c.on(r, 'pointerdown', e => { if (e.isTrusted && e.pointerType !== 'touch') engage(); }, true);
  c.on(r, 'pointerup', e => { if (e.isTrusted && e.pointerType === 'touch') engage(); }, true);
  c.on(r, 'focusin', e => { if (e.isTrusted && e.timeStamp - lastKey < 100) engage(); }, true);
  c.on(vp, 'pointerdown', e => {
    if (e.target.closest('.acx-n, .acx-h, .acx-sc') || (e.button !== 0 && e.button !== 1) || (e.pointerType === 'touch' && !engaged)) return;
    e.preventDefault();
    // a click on the canvas gives it the focus, so the keys work straight away
    if (e.isTrusted) cv.focus({ preventScroll:true });
    const p = pt(e);
    if (e.pointerType === 'touch'){
      touch.set(e.pointerId, p);
      if (touch.size === 2){ const q = pinch(); drag = { kind:'pinch', d0:q.d, m0:q.m, z0:z, px0:px, py0:py, moved:true }; }
      else if (touch.size === 1) drag = { kind:'pan', id:e.pointerId, p0:p, px0:px, py0:py, moved:false };
    } else drag = { kind:e.shiftKey && e.button === 0 ? 'box' : 'pan', id:e.pointerId, p0:p, px0:px, py0:py, base:new Set(sel), moved:false };
    if (drag && drag.kind === 'pan') cv.classList.add('pan');
    try { vp.setPointerCapture(e.pointerId); } catch(err){}
  });
  c.on(vp, 'pointermove', e => {
    if (!drag) return; const p = pt(e);
    if (touch.has(e.pointerId)) touch.set(e.pointerId, p);
    if (drag.kind === 'pinch'){
      if (touch.size < 2) return; const q = pinch(), nz = lim(drag.z0 * q.d / drag.d0), wx = (drag.m0[0] - drag.px0) / drag.z0, wy = (drag.m0[1] - drag.py0) / drag.z0;
      z = nz; px = q.m[0] - wx * z; py = q.m[1] - wy * z; apply(false); return;
    }
    if (e.pointerId !== drag.id) return;
    const dx = p[0] - drag.p0[0], dy = p[1] - drag.p0[1];
    if (!drag.moved && Math.hypot(dx, dy) < 3) return; drag.moved = true;
    if (drag.kind === 'pan'){ px = drag.px0 + dx; py = drag.py0 + dy; apply(false); return; }
    const x = Math.min(p[0], drag.p0[0]), y = Math.min(p[1], drag.p0[1]), w = Math.abs(dx), h = Math.abs(dy);
    mq.hidden = false; mq.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    select([...drag.base, ...N.filter(n => placed(n) && (s2 => s2.r > x && s2.l < x + w && s2.b > y && s2.t < y + h)(scr(box(el(n.id))))).map(n => n.id)]);
  });
  const end = e => {
    touch.delete(e.pointerId);
    if (!drag) return;
    // lifting one finger of a pinch carries on as a pan with the other
    if (drag.kind === 'pinch'){ const [id, p] = [...touch.entries()][0] || []; drag = id === undefined ? null : { kind:'pan', id, p0:p, px0:px, py0:py, moved:true }; return; }
    if (e.pointerId !== drag.id) return;
    const k = drag.kind, m = drag.moved; drag = null; cv.classList.remove('pan'); mq.hidden = true;
    if (k === 'box') picked();
    else if (!m && e.type === 'pointerup' && sel.size){ select([]); picked(); }
  };
  c.on(vp, 'pointerup', end); c.on(vp, 'pointercancel', end);
  /* the wheel never traps the page: it pans the view only once the person has engaged with the component (see above), and
     until then the page scrolls past as usual. With Ctrl or ⌘ (a trackpad pinch sends that too) it zooms at the pointer
     at any time. Over the picker's list it scrolls the list */
  c.on(cv, 'wheel', e => {
    if (pk.contains(e.target) || pop.contains(e.target)) return;
    const zoomer = e.ctrlKey || e.metaKey; if (!zoomer && !engaged) return;
    e.preventDefault(); if (e.isTrusted) c.mine = true;
    if (zoomer) return zoomAt(z * Math.exp(-e.deltaY / 300), ...pt(e), false);
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? cv.clientHeight : 1;
    let dx = e.deltaX * k, dy = e.deltaY * k; if (e.shiftKey && !dx){ dx = dy; dy = 0; }
    px -= dx; py -= dy; apply(false);
  }, { passive:false });
  // a pointer hides the canvas's focus ring until the next key (Ctrl, ⌘, Shift or Alt alone, as with the wheel, leave it hidden)
  c.on(cv, 'pointerdown', () => cv.classList.add('ptr'), true); c.on(document, 'keydown', e => { if (!/^(Control|Meta|Shift|Alt)$/.test(e.key)) cv.classList.remove('ptr'); }, true);
  /* the keyboard, while the canvas or a step has the focus: the arrow keys move the view (on the canvas itself), plus and
     minus zoom, 0 or 1 fits, Escape clears the selection; Tab goes through the steps and their + buttons, and a step that
     takes the focus off screen glides into view */
  c.on(cv, 'keydown', e => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || pop.contains(e.target) || pk.contains(e.target) || /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    const k = e.key;
    if (k === '+' || k === '=') zoomBy(1);
    else if (k === '-' || k === '_') zoomBy(-1);
    else if (k === '0' || k === '1' || e.code === 'Digit0' || e.code === 'Digit1') fit();
    else if (e.target === cv && /^Arrow/.test(k)){ const d = e.shiftKey ? 120 : 40; px += k === 'ArrowLeft' ? d : k === 'ArrowRight' ? -d : 0; py += k === 'ArrowUp' ? d : k === 'ArrowDown' ? -d : 0; apply(true); }
    else if (k === 'Escape' && sel.size){ select([]); picked(); }
    else return;
    e.preventDefault();
  });
  c.on(nodes, 'focusin', e => {
    if (cv.classList.contains('ptr')) return;
    const t = e.target.closest('.acx-n, .acx-h, .acx-sc'); if (!t) return;
    const s2 = scr(box(t)), W = cv.clientWidth, H = cv.clientHeight, M = 16, { T, B } = safe();
    const dx = s2.l < M ? M - s2.l : s2.r > W - M ? W - M - s2.r : 0, dy = s2.t < T ? T - s2.t : s2.b > H - B ? H - B - s2.b : 0;
    if (dx || dy){ px += dx; py += dy; apply(true); }
  });
  // the board never scrolls inside the canvas: a focus that would scroll it pans the view instead (above)
  c.on(vp, 'scroll', () => { vp.scrollLeft = vp.scrollTop = 0; });

  // a step's badge pops in once (CSS), and after that its spinner turns into a check with a short crossfade
  const ease = getComputedStyle(r).getPropertyValue('--ease').trim() || 'ease';
  const mark = (id, s) => { const b = el(id); b.classList.toggle('run', s === 'run'); const x = $('.s', b) || b.appendChild(html('<span class="s"></span>'));
    x.innerHTML = `<span class="acx-sv">${s === 'run' ? '<span class="spin" style="width:10px;height:10px"></span>' : `<span style="color:var(--ok);display:grid">${I('check','xs')}</span>`}</span>`; };
  // a run passes along a wire as one soft light, then leaves the wire lit
  const flow = (a, b) => { const p = wireEl[key(a, b)]; if (!p) return; p.classList.add('done'); if (REDUCE) return;
    const L = p.getTotalLength(), len = Math.min(64, L * .4), q = p.cloneNode(); q.removeAttribute('data-e'); q.setAttribute('class', 'pulse'); q.style.cssText = `stroke-dasharray:${len} ${L + len}`; svg.appendChild(q);
    q.animate([{ strokeDashoffset:len, opacity:0 }, { opacity:1, offset:.18 }, { opacity:1, offset:.78 }, { strokeDashoffset:-L, opacity:0 }], { duration:720, easing:'cubic-bezier(.45,0,.25,1)' }).onfinish = () => q.remove(); };
  // a new test run cancels one still in progress and starts over, rather than running alongside it. The agent's model and
  // tools light up while it runs, and the steps added after the last one run in turn
  let runId = 0, running = false;
  const runB = $('.acx-run', r);
  runB.onclick = () => c.run(async () => {
    const id = ++runId, wait = async ms => { await c.wait(ms); if (id !== runId) throw 'stop'; };
    running = true;
    try {
      // the last run's badges and lit wires fade back before the new run starts
      close(); closePk(); $$('.acx-n .s', nodes).forEach(x => { if (REDUCE) return x.remove(); x.animate([{ opacity:1 }, { opacity:0, transform:'scale(.7)' }], { duration:200, easing:ease }).onfinish = () => x.remove(); });
      $$('.acx-n.run', nodes).forEach(x => x.classList.remove('run')); $$('path.done', svg).forEach(x => x.classList.remove('done')); swap(st, 'Running test');
      const subs = E.filter(e => e[0] === 'b' && e[2]).map(e => e[1]);
      await wait(220); mark('t', 'run'); await wait(600); mark('t', 'ok');
      flow('t','a'); flow('t','b'); await wait(620);
      mark('a', 'run'); mark('b', 'run'); subs.forEach(x => { flow('b', x); mark(x, 'run'); }); await wait(1100); mark('a', 'ok'); subs.forEach(x => mark(x, 'ok')); await wait(400); mark('b', 'ok');
      flow('a','c'); flow('b','c'); await wait(620);
      mark('c', 'run'); await wait(700); mark('c', 'ok');
      let at = 'c', s = 3.4, nx;
      while ((nx = E.find(e => e[0] === at && !e[2]))){ flow(at, nx[1]); await wait(620); mark(nx[1], 'run'); await wait(700); mark(nx[1], 'ok'); at = nx[1]; s += 1.3; }
      swap(st, `Test passed in ${s.toFixed(1)}s`);
    } finally { if (id === runId) running = false; }
  });
  svg.classList.add('intro'); c.later(1300, () => svg.classList.remove('intro'));
  // a canvas that switches between wide and stacked lays its steps out afresh, and the view goes back to showing it whole
  layout(); apply(false); let lw = 0, ln = narrow();
  const ro = new ResizeObserver(() => { if (lw && Math.abs(cv.clientWidth - lw) > 2){ close(); closePk(); } lw = cv.clientWidth; if (ln !== narrow()){ ln = narrow(); z = 1; px = py = 0; } layout(); apply(false); }); ro.observe(cv); c.offs.push(() => ro.disconnect());
  $$('.acx-n, .acx-h, .acx-sc', nodes).forEach((b, i) => { b.dataset.seen = 1; b.classList.add(b.matches('.acx-n') ? 'acx-in' : 'in'); b.style.animationDelay = Math.min(i, 4) * 90 + 'ms'; });
  // the preview's story: one test run, then the person adds a step after the last one from its +, zooms in a step and fits
  // the whole automation back in view
  c.story(async s => {
    await s.beat(3);
    await s.tap(runB); s.away();
    await s.until(() => !running); await s.beat(2);
    const h = knobs['c:out']; if (!h) return;
    await s.tap(h); await s.beat(1.5);
    const o = opts.find(x => x.dataset.t === 'Create ticket'); if (!o) return;
    await s.point(o, false); hl(opts.indexOf(o), true); await s.beat(1.5);
    await s.tap(o); s.away(); await s.beat(3);
    await s.tap(zi); await s.beat(2);
    await s.tap(fitB); s.away(); await s.beat(3);
  });
});
/* ---------- Canvas toolbar ---------- */
DM.def('canvas-toolbar', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{(play|cursor|hand|lasso|comment|fit|minus|plus|more|zoom|trash)\}/g, (m, n) => I(n === 'zoom' ? 'search' : n, n === 'play' || n === 'trash' ? 'xs' : 's'));
  const root = $('.ctb', r), cv = $('.ctb-cv', r), world = $('.ctb-world', r), wires = $('.ctb-w', r), nodes = $('.ctb-nodes', r), bar = $('.ctb-bar', r), live = $('.ctb-live', r);
  const runB = $('.ctb-run', r), radios = $$('.ctb-tools [role="radio"]', r), cmB = $('.ctb-cm', r), fitB = $('.ctb-fit', r), zoB = $('.ctb-zo', r), ziB = $('.ctb-zi', r), zl = $('.ctb-z', r);
  const menu = $('.ctb-menu', r), more = $('.ctb-more', r), mq = $('.ctb-mq', r), lz = $('.ctb-lz path', r), sr = $('.ctb-sr', r);
  sr.id = 'ctb-k-' + Math.random().toString(36).slice(2, 7); cv.setAttribute('aria-describedby', sr.id);
  const say = t => { live.textContent = t; };
  // every change a person makes is also an event on the component, for your code to follow
  const emit = (type, detail) => root.dispatchEvent(new CustomEvent(type, { bubbles:true, detail }));
  // the workflow on the canvas, in pixels at 100%: a row on a wide canvas, a column on a narrow one, so a phone shows it
  // whole at a size that reads
  const N = [
    { id:'a', ic:'bolt', col:'var(--py)', t:'New ticket', d:'Trigger · inbox', w:[0, 48], n:[0, 0] },
    { id:'b', ic:'spark', col:'var(--accent-mark,var(--accent))', fg:'var(--accent-fg,var(--accent))', t:'Classify', d:'Agent · intent', w:[208, 0], n:[0, 80] },
    { id:'c', ic:'search', col:'var(--pb)', t:'Search docs', d:'Tool · help center', w:[416, 96], n:[0, 160] },
    { id:'d', ic:'edit', col:'var(--pm)', t:'Draft reply', d:'Agent · for review', w:[624, 48], n:[0, 240] }
  ];
  const E = [['a', 'b'], ['b', 'c'], ['c', 'd']], ORDER = N.map(n => n.id);
  nodes.innerHTML = N.map(n => `<div class="ctb-n in" data-id="${n.id}"><span class="ic" style="color:${n.fg || n.col};background:color-mix(in srgb,${n.col} 14%,transparent)">${I(n.ic, 'xs')}</span><span class="t"><b>${n.t}</b><span>${n.d}</span></span></div>`).join('');
  $$('.ctb-n', nodes).forEach((x, i) => { x.style.animationDelay = i * 90 + 'ms'; });
  const el = id => $(`.ctb-n[data-id="${id}"]`, nodes);
  const box = n => { const e = el(n.id); return { x:n.x, y:n.y, w:e.offsetWidth, h:e.offsetHeight }; };
  // below 440px the steps sit in a column; a step someone dragged keeps where they put it, in each layout
  const NARROW = 440;
  let small = false;
  function layout(){
    small = cv.clientWidth < NARROW;
    N.forEach(n => { const p = (small ? n.um : n.uw) || (small ? n.n : n.w); n.x = p[0]; n.y = p[1]; const e = el(n.id); e.style.left = n.x + 'px'; e.style.top = n.y + 'px'; });
    drawWires();
  }
  const wireEl = {};
  function drawWires(){
    E.forEach(([a, b]) => {
      const A = box(N.find(n => n.id === a)), B = box(N.find(n => n.id === b)); let d;
      // side to side when the next step is beside this one, top to bottom when it is under it
      if (Math.abs(B.x - A.x) >= Math.abs(B.y - A.y)){ const ltr = B.x > A.x, x1 = ltr ? A.x + A.w : A.x, x2 = ltr ? B.x : B.x + B.w, y1 = A.y + A.h / 2, y2 = B.y + B.h / 2, m = (x1 + x2) / 2; d = `M${x1} ${y1}C${m} ${y1} ${m} ${y2} ${x2} ${y2}`; }
      else { const dn = B.y > A.y, y1 = dn ? A.y + A.h : A.y, y2 = dn ? B.y : B.y + B.h, x1 = A.x + A.w / 2, x2 = B.x + B.w / 2, m = (y1 + y2) / 2; d = `M${x1} ${y1}C${x1} ${m} ${x2} ${m} ${x2} ${y2}`; }
      let p = wireEl[a + b]; if (!p){ p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); wires.appendChild(p); wireEl[a + b] = p; }
      p.setAttribute('d', d);
    });
  }
  /* ---------- the view: zoom z and pan (px, py), so a point x on the canvas shows at x * z + px ---------- */
  const Z = [.25, .33, .5, .67, .75, .9, 1, 1.25, 1.5, 2, 3, 4], MIN = Z[0], MAX = Z[Z.length - 1];
  let z = 1, px = 0, py = 0, moved = false;
  const lim = v => Math.max(MIN, Math.min(MAX, v)), pct = () => Math.round(z * 100) + '%';
  function apply(anim){
    if (cpFor) closeCp();
    cv.classList.toggle('anim', !!anim && !REDUCE);
    world.style.transform = `translate(${px}px,${py}px) scale(${z})`;
    // the dots move and scale with the view, and spread out again when it is zoomed far out
    const g = 16 * z * (z < .5 ? 2 : 1); cv.style.backgroundSize = `${g}px ${g}px`; cv.style.backgroundPosition = `${px}px ${py}px`;
    zl.textContent = pct(); zl.setAttribute('aria-label', `Zoom ${pct()}, reset to 100%`); $('.ctb-zl', menu).textContent = pct();
    const lo = z <= MIN + 1e-3, hi = z >= MAX - 1e-3;
    [zoB, $('[data-a="out"]', menu)].forEach(b => b.setAttribute('aria-disabled', lo));
    [ziB, $('[data-a="in"]', menu)].forEach(b => b.setAttribute('aria-disabled', hi));
  }
  function zoomAt(nz, cx, cy, anim){ nz = lim(nz); const wx = (cx - px) / z, wy = (cy - py) / z; z = nz; px = cx - wx * z; py = cy - wy * z; moved = true; apply(anim); }
  // the room the workflow has: the canvas above the toolbar
  const room = () => ({ W:cv.clientWidth, H:cv.clientHeight - bar.offsetHeight - 20 });
  const mid = () => { const { W, H } = room(); return [W / 2, H / 2]; };
  const next = d => { const s = d > 0 ? Z.find(x => x > z + 1e-3) : [...Z].reverse().find(x => x < z - 1e-3); return s === undefined ? z : s; };
  function zoomBy(d){ const nz = next(d); if (nz === z) return; zoomAt(nz, ...mid(), true); say('Zoom ' + pct()); emit('canvas-zoom', { zoom:z }); }
  function zoomReset(){ zoomAt(1, ...mid(), true); say('Zoom 100%'); emit('canvas-zoom', { zoom:z }); }
  // fit: the whole workflow in the room above the toolbar, centred, never more than 150% (on mount, never past 100%)
  function fit(anim, cap = 1.5){
    const { W, H } = room(), P = 24, bs = N.map(box);
    const x0 = Math.min(...bs.map(b => b.x)), y0 = Math.min(...bs.map(b => b.y)), x1 = Math.max(...bs.map(b => b.x + b.w)), y1 = Math.max(...bs.map(b => b.y + b.h));
    z = lim(Math.min((W - 2 * P) / (x1 - x0), (H - 2 * P) / (y1 - y0), cap));
    px = (W - (x1 - x0) * z) / 2 - x0 * z; py = (H - (y1 - y0) * z) / 2 - y0 * z;
    apply(anim);
  }
  function fitNow(){ fit(true); moved = true; say('Fit to screen, ' + pct()); emit('canvas-zoom', { zoom:z }); }
  /* ---------- tools: Select, Hand and Lasso are one radio group; Comment is a toggle beside them ---------- */
  const NAMES = { select:'Select', hand:'Hand', lasso:'Lasso' };
  let tool = 'select', commenting = false;
  function setTool(t, focus){
    tool = t; root.dataset.tool = t;
    radios.forEach(b => { const on = b.dataset.t === t; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    if (focus) $(`[data-t="${t}"]`, bar).focus({ preventScroll:true });
    setComment(false, true); say(NAMES[t] + ' tool'); emit('canvas-tool', { tool:t });
  }
  function setComment(on, quiet){
    if (commenting === on) return; commenting = on; root.classList.toggle('cm', on);
    cmB.setAttribute('aria-pressed', on); $('[data-a="comment"]', menu).setAttribute('aria-checked', on);
    if (!quiet) say(on ? 'Comment: click the canvas to place it' : 'Comment off');
  }
  radios.forEach(b => b.onclick = () => setTool(b.dataset.t));
  // the arrow keys move through the tools and pick each one (focus follows the pick); Home and End jump to the ends
  c.on($('.ctb-tools', r), 'keydown', e => {
    const i = radios.indexOf(document.activeElement); if (i < 0) return;
    const d = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 }[e.key], j = d ? (i + d + radios.length) % radios.length : e.key === 'Home' ? 0 : e.key === 'End' ? radios.length - 1 : -1;
    if (j < 0) return; e.preventDefault(); e.stopPropagation(); setTool(radios[j].dataset.t, true);
  });
  cmB.onclick = () => setComment(!commenting);
  fitB.onclick = fitNow;
  zoB.onclick = () => zoomBy(-1); ziB.onclick = () => zoomBy(1); zl.onclick = zoomReset;
  $$('.mi', menu).forEach(m => m.onclick = () => ({ comment:() => setComment(!commenting), fit:fitNow, out:() => zoomBy(-1), in:() => zoomBy(1), reset:zoomReset })[m.dataset.a]());
  /* ---------- the canvas: Hand (or the middle button) pans, Select picks and moves steps or draws a box, Lasso draws a
     shape round what it picks, and Comment drops a pin. Ctrl or ⌘ with the wheel, or a pinch, zooms at the pointer ---------- */
  let sel = new Set(), drag = null, pins = 0;
  function select(ids){ sel = new Set(ids); N.forEach(n => el(n.id).classList.toggle('sel', sel.has(n.id))); }
  const pt = e => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const screen = n => { const b = box(n); return { l:b.x * z + px, t:b.y * z + py, r:(b.x + b.w) * z + px, b:(b.y + b.h) * z + py }; };
  const inside = ([x, y], poly) => { let k = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++){ const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) k = !k; } return k; };
  function pin([x, y]){
    const n = ++pins, p = html(`<button class="ctb-pin" aria-label="Comment ${n}" aria-haspopup="dialog" aria-expanded="false">${n}</button>`);
    p.style.left = x + 'px'; p.style.top = y + 'px'; p.dataset.n = n; p.dataset.x = x; p.dataset.y = y; world.appendChild(p);
    p.onclick = e => { e.stopPropagation(); cpFor === p ? closeCp(true) : openCp(p, e.isTrusted); };
    // Delete or Backspace on a pin deletes it straight away
    p.onkeydown = e => { if (e.key === 'Delete' || e.key === 'Backspace'){ e.preventDefault(); e.stopPropagation(); unpin(p); } else if (e.key === 'Escape' && cpFor === p){ e.preventDefault(); e.stopPropagation(); closeCp(true); } };
    setComment(false, true); say(`Comment ${n} placed`); emit('canvas-comment', { x:Math.round(x), y:Math.round(y) });
    return p;
  }
  /* ---------- a pin opens its comment, with Delete: the pin fades out and the focus goes back to the canvas ---------- */
  const cp = $('.ctb-cp', r), cpDel = $('.ctb-del', r); let cpFor = null; cp.inert = true;
  // which step a pin sits on or nearest to, so the comment says where it is
  const near = p => { const x = +p.dataset.x, y = +p.dataset.y; let best = null, bd = Infinity;
    N.forEach(n => { const b = box(n), dx = Math.max(b.x - x, 0, x - b.x - b.w), dy = Math.max(b.y - y, 0, y - b.y - b.h), d = Math.hypot(dx, dy); if (d < bd){ bd = d; best = n; } });
    return bd === 0 ? 'On ' + best.t : bd < 80 ? 'Near ' + best.t : 'On the canvas'; };
  function openCp(p, focus){
    if (cpFor) cpFor.setAttribute('aria-expanded', 'false');
    cpFor = p; p.setAttribute('aria-expanded', 'true');
    const n = p.dataset.n; $('.ctb-ct', cp).textContent = 'Comment ' + n; $('.ctb-cw', cp).textContent = near(p);
    cp.setAttribute('aria-label', 'Comment ' + n); cpDel.setAttribute('aria-label', 'Delete comment ' + n);
    // beside the pin, kept inside the room above the toolbar
    const W = cv.clientWidth, H = cv.clientHeight - bar.offsetHeight - 20, pb = p.getBoundingClientRect(), cb = cv.getBoundingClientRect(), pw = cp.offsetWidth, ph = cp.offsetHeight, G = 8, M = 8;
    let x = pb.right - cb.left + G, y = pb.top - cb.top;
    if (x + pw > W - M) x = pb.left - cb.left - G - pw;
    cp.style.left = Math.max(M, Math.min(W - pw - M, x)) + 'px'; cp.style.top = Math.max(M, Math.min(H - ph, y)) + 'px';
    cp.classList.add('open'); cp.inert = false;
    if (focus) cpDel.focus({ preventScroll:true });
  }
  function closeCp(back){
    if (!cpFor) return; const p = cpFor, was = cp.contains(document.activeElement);
    cp.classList.remove('open'); cp.inert = true; p.setAttribute('aria-expanded', 'false'); cpFor = null;
    if (p.isConnected && (back || was)) p.focus({ preventScroll:true });
  }
  function unpin(p){
    const n = p.dataset.n, was = cp.contains(document.activeElement) || document.activeElement === p;
    if (cpFor === p){ cp.classList.remove('open'); cp.inert = true; cpFor = null; }
    p.classList.add('gone'); setTimeout(() => p.remove(), REDUCE ? 0 : 180);
    if (was) cv.focus({ preventScroll:true });
    say(`Comment ${n} deleted`); emit('canvas-comment-delete', { n:+n });
  }
  cpDel.onclick = e => { e.stopPropagation(); if (cpFor) unpin(cpFor); };
  c.on(cp, 'keydown', e => { if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); closeCp(true); } });
  c.on(cp, 'pointerdown', e => e.stopPropagation());
  c.on(document, 'pointerdown', e => { if (cpFor && !cp.contains(e.target) && e.target !== cpFor) closeCp(); });
  // a pointer in the component hides the canvas's focus ring until the next key
  c.on(root, 'pointerdown', () => cv.classList.add('ptr'), true); c.on(root, 'keydown', () => cv.classList.remove('ptr'), true);
  /* the canvas never traps the page: until the person has engaged with the component (a click in it, a tap in it, or the
     keyboard's focus coming into it) a finger on the canvas belongs to the page, so it scrolls past as usual, and one that
     lifts without scrolling is a tap, which engages it. Once engaged (.engaged), a finger works the tool as the mouse does */
  let engaged = false, lastKey = -1e9;
  const engage = () => { if (engaged) return; engaged = true; cv.classList.add('engaged'); };
  c.on(document, 'keydown', e => { if (e.isTrusted) lastKey = e.timeStamp; }, true);
  c.on(root, 'pointerdown', e => { if (e.isTrusted && e.pointerType !== 'touch') engage(); }, true);
  c.on(root, 'pointerup', e => { if (e.isTrusted && e.pointerType === 'touch') engage(); }, true);
  c.on(root, 'focusin', e => { if (e.isTrusted && e.timeStamp - lastKey < 100) engage(); }, true);
  c.on(cv, 'pointerdown', e => {
    if ((e.button !== 0 && e.button !== 1) || (e.pointerType === 'touch' && !engaged)) return;
    // a pin is a button: pressing it opens its comment, whatever the tool
    if (e.button === 0 && e.target.closest('.ctb-pin')) return;
    const p = pt(e), node = e.target.closest('.ctb-n');
    // a click on the canvas gives it the focus, so the shortcuts work straight away
    if (e.isTrusted) cv.focus({ preventScroll:true });
    e.preventDefault();
    if (commenting && e.button === 0) return pin([(p[0] - px) / z, (p[1] - py) / z]);
    const kind = e.button === 1 || tool === 'hand' ? 'pan' : tool === 'select' ? (node ? 'move' : 'box') : 'lasso';
    if (kind === 'move'){ const id = node.dataset.id; if (e.shiftKey){ const s = new Set(sel); s.has(id) ? s.delete(id) : s.add(id); select(s); } else if (!sel.has(id)) select([id]); }
    else if (kind !== 'pan' && !e.shiftKey) select([]);
    drag = { kind, p0:p, px, py, pts:[p], from:N.map(n => [n.x, n.y]), base:new Set(sel) };
    if (kind === 'pan') cv.classList.add('pan');
    try { cv.setPointerCapture(e.pointerId); } catch(err){}
  });
  c.on(cv, 'pointermove', e => {
    if (!drag) return;
    const p = pt(e), dx = p[0] - drag.p0[0], dy = p[1] - drag.p0[1];
    if (drag.kind === 'pan'){ px = drag.px + dx; py = drag.py + dy; moved = true; apply(false); }
    else if (drag.kind === 'move'){
      N.forEach((n, i) => { if (!sel.has(n.id)) return; n.x = drag.from[i][0] + dx / z; n.y = drag.from[i][1] + dy / z; const e2 = el(n.id); e2.style.left = n.x + 'px'; e2.style.top = n.y + 'px'; if (small) n.um = [n.x, n.y]; else n.uw = [n.x, n.y]; });
      drawWires();
    } else if (drag.kind === 'box'){
      const x = Math.min(p[0], drag.p0[0]), y = Math.min(p[1], drag.p0[1]), w = Math.abs(dx), h = Math.abs(dy);
      mq.hidden = false; mq.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
      select([...drag.base, ...N.filter(n => { const s = screen(n); return s.r > x && s.l < x + w && s.b > y && s.t < y + h; }).map(n => n.id)]);
    } else {
      drag.pts.push(p); lz.setAttribute('d', 'M' + drag.pts.map(q => q.map(Math.round).join(' ')).join('L') + 'Z');
      select([...drag.base, ...N.filter(n => { const s = screen(n); return inside([(s.l + s.r) / 2, (s.t + s.b) / 2], drag.pts); }).map(n => n.id)]);
    }
  });
  const end = () => {
    if (!drag) return; const k = drag.kind; drag = null;
    cv.classList.remove('pan'); mq.hidden = true; lz.setAttribute('d', '');
    if (k === 'box' || k === 'lasso' || k === 'move') say(sel.size ? `${sel.size} of ${N.length} steps selected` : 'Nothing selected');
  };
  c.on(cv, 'pointerup', end); c.on(cv, 'pointercancel', end);
  c.on(cv, 'wheel', e => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); zoomAt(z * Math.exp(-e.deltaY / 300), ...pt(e), false); }, { passive:false });
  /* ---------- the keyboard: V, H and L pick a tool, C comments, Shift+1 fits, Shift+0 is 100%, minus and plus zoom, the
     arrow keys pan while the canvas has the focus, and Escape leaves Comment or clears the selection ---------- */
  c.on(root, 'keydown', e => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || menu.contains(e.target) || cp.contains(e.target) || /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    const k = e.key, low = k.length === 1 ? k.toLowerCase() : '';
    if (e.shiftKey && e.code === 'Digit1') fitNow();
    else if (e.shiftKey && e.code === 'Digit0') zoomReset();
    else if (k === '+' || k === '=') zoomBy(1);
    else if (k === '-' || k === '_') zoomBy(-1);
    else if (!e.shiftKey && 'vhl'.includes(low) && low) setTool({ v:'select', h:'hand', l:'lasso' }[low], radios.includes(e.target));
    else if (!e.shiftKey && low === 'c') setComment(!commenting);
    else if (e.target === cv && /^Arrow/.test(k)){ const d = e.shiftKey ? 120 : 40; px += k === 'ArrowLeft' ? d : k === 'ArrowRight' ? -d : 0; py += k === 'ArrowUp' ? d : k === 'ArrowDown' ? -d : 0; moved = true; apply(true); }
    else if (k === 'Escape' && (commenting || sel.size)){ if (commenting) setComment(false); else { select([]); say('Nothing selected'); } }
    else return;
    e.preventDefault();
  });
  /* ---------- Run: the steps light up one after another along their wires, then it stops by itself; Stop ends it early ---------- */
  let runId = 0, running = false;
  function setRun(on){ running = on; runB.classList.toggle('stop', on); runB.innerHTML = I(on ? 'stop' : 'play', 'xs') + `<span>${on ? 'Stop' : 'Run'}</span>`; }
  const mark = (id, s) => {
    const e = el(id); e.classList.toggle('run', s === 'run'); let b = $('.s', e);
    if (!s){ if (b) b.remove(); return; }
    if (!b) b = e.appendChild(html('<span class="s" aria-hidden="true"></span>'));
    b.innerHTML = s === 'run' ? '<span class="spin"></span>' : I('check', 'xs');
  };
  function run(){
    const id = ++runId; setRun(true); ORDER.forEach(x => mark(x, null)); Object.values(wireEl).forEach(p => p.classList.remove('lit'));
    say('Running the workflow'); emit('canvas-run', {});
    c.run(async () => {
      const w = async ms => { await c.wait(ms); if (id !== runId) throw 'stop'; };
      for (let i = 0; i < ORDER.length; i++){
        mark(ORDER[i], 'run'); await w(i ? 700 : 450); mark(ORDER[i], 'ok');
        if (i < ORDER.length - 1){ wireEl[ORDER[i] + ORDER[i + 1]].classList.add('lit'); await w(250); }
      }
      await w(500); setRun(false); say(`Run finished: ${ORDER.length} of ${ORDER.length} steps passed`); emit('canvas-stop', { finished:true });
    });
  }
  function stop(){ runId++; setRun(false); ORDER.forEach(x => { if (el(x).classList.contains('run')) mark(x, null); }); say('Run stopped'); emit('canvas-stop', { finished:false }); }
  runB.onclick = () => running ? stop() : run();
  // the view fits the workflow until someone moves it; a canvas that changes between wide and narrow fits it again
  layout(); fit(false, 1);
  let lw = cv.clientWidth;
  const ro = new ResizeObserver(() => { const W = cv.clientWidth; if (W && W !== lw){ const was = small; lw = W; layout(); if (!moved || was !== small) fit(false, 1); } });
  ro.observe(cv); ro.observe(bar); c.offs.push(() => ro.disconnect());
  // the preview's story: take the hand and drag the workflow aside, zoom in twice, fit it back to the screen, then run it
  c.story(async s => {
    const shown = b => b.getClientRects().length > 0;
    // a button a narrow toolbar keeps in More is pressed from there
    const press = async (b, a) => {
      if (shown(b)) return s.tap(b);
      if (!menu.classList.contains('open')){ await s.tap(more); await s.beat(1); }
      await s.tap($(`.mi[data-a="${a}"]`, menu));
    };
    await s.beat(3);
    await s.tap(radios[1]); await s.beat(1);
    const aim = html('<i class="ctb-aim" aria-hidden="true"></i>'); cv.appendChild(aim);
    const at = (x, y) => { aim.style.left = Math.round(x) + 'px'; aim.style.top = Math.round(y) + 'px'; };
    // on a narrow canvas the column moves a little down and zooms out instead, so no step ever leaves the canvas
    const W = cv.clientWidth, H = cv.clientHeight, D = small ? 0 : Math.min(140, W * .22), V = small ? 32 : 24;
    at(W * .6, H * .3); await s.point(aim, false);
    const hand = $('.hand', r); if (hand) hand.classList.add('down'); await s.beat(.5);
    at(W * .6 - D, H * .3 + V); px -= D; py += V; moved = true; apply(true);
    await s.point(aim, false); if (hand) hand.classList.remove('down'); await s.beat(2);
    const zb = small ? zoB : ziB, za = small ? 'out' : 'in';
    await press(zb, za); await s.beat(1.5);
    await press(zb, za); await s.beat(2);
    await press(fitB, 'fit'); await s.beat(2);
    await s.tap(radios[0]); await s.beat(1);
    await s.tap(runB); s.away();
    await s.until(() => !running); await s.beat(3);
  });
});
/* ---------- Step inspector ---------- */
DM.def('step-inspector', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)(?:\.(xs))?\}/g, (m, k, z) => I(k, z || 's'));
  const uid = 'sti' + Math.random().toString(36).slice(2, 7);
  const body = $('.sti-body', r), nameIn = $('.sti-n', r), kd = $('.sti-kd', r), tile = $('.sti-h>.sti-ti', r), live = $('.sti-live', r);
  const pk = $('.sti-pk', r), dp = $('.sti-dp', r), mm = $('.sti-mm', r), testB = $('.sti-test', r), nr = $('.sti-nr', r);
  const KIND = { trigger:'Trigger', ai:'AI step', tool:'Tool', app:'App step', output:'Output', branch:'Branch', wait:'Wait', approval:'Approval' };
  // each data type has its colour: text blue, numbers green, lists orange, objects pink, yes or no yellow, dates teal
  const TY = { text:'b', number:'m', list:'p', object:'k', bool:'y', date:'t' };
  // the workflow around the step: what each step hands on, as [field, type, sample]
  const SRC = {
    form:{ t:'Demo request form', k:'trigger', ic:'file-text', out:[['name', 'text', 'Priya Shah'], ['email', 'text', 'priya@corvid.io'], ['company', 'text', 'Corvid Analytics'], ['seats', 'number', '240']] },
    lookup:{ t:'Company lookup', k:'tool', ic:'globe', out:[['employees', 'number', '420'], ['industry', 'text', 'Analytics software'], ['funding', 'text', 'Series B']] },
    research:{ t:'Research and score', k:'ai', ic:'spark', out:[['score', 'number', '84'], ['tier', 'text', 'Enterprise'], ['reasons', 'list', '3 reasons'], ['company', 'object', '{ 5 fields }']] },
    reply:{ t:'Draft a reply', k:'ai', ic:'edit', out:[['subject', 'text', 'Your demo with Fernhill'], ['body', 'text', 'Hi Priya, thanks for writing']] },
    nurture:{ t:'Add to nurture list', k:'app', ic:'users', out:[] }
  };
  const PEOPLE = { MK:['Maya Kim', 'l'], TR:['Theo Reed', 't'], AN:['Ana Novak', 'p'], JB:['Jonah Brooks', 'm'] };
  const TOOLS = [['lookup', 'Company lookup', 'globe'], ['search', 'Web search', 'search'], ['crm', 'CRM lookup', 'db']];
  const OPTS = { model:[['Sonnet 5.5', 'Balanced, the default'], ['Opus 5.5', 'Deepest reasoning, slower'], ['Haiku 5.5', 'Fastest and cheapest']], op:[['is at least'], ['is below'], ['is exactly']],
    via:[['Slack message'], ['Email'], ['In the app']], expire:[['4 hours'], ['24 hours'], ['3 days']], then:[['Stop the run'], ['Send it anyway'], ['Ask someone else']],
    limit:[['15 seconds'], ['30 seconds'], ['60 seconds']], onfail:[['Stop the run'], ['Skip this step'], ['Carry on with empty data']] };
  const LABEL = { model:'Model', op:'Comparison', via:'Ask in', expire:'Nobody answers in', then:'Then', limit:'Time limit', onfail:'If it still fails' };
  // the three steps the demo switches between, each with only the settings its kind has. The AI step reads an email from a
  // step called Contact, which is no longer in the workflow, so that input is flagged
  const STEP = {
    ai:{ n:'Research and score', ic:'spark', at:2, up:['form', 'lookup'], model:'Sonnet 5.5', tools:['lookup'],
      ins:['Look up ', 'form.company', ' and the person who wrote in. Score how well they fit our plans from 0 to 100, with three reasons.\nTheir team is ', 'lookup.employees', ' people.'],
      in:[['company', 'form.company'], ['seats', 'form.seats'], ['email', 'contact.email']], out:SRC.research.out, retries:1, backoff:'fixed', limit:'60 seconds', onfail:'Stop the run' },
    branch:{ n:'Good fit?', ic:'branch', at:3, up:['form', 'lookup', 'research'], rule:{ v:'research.score', op:'is at least', n:70 }, yes:'reply', no:'nurture', out:[['path', 'text', 'Yes']] },
    approval:{ n:'Rep approves', ic:'user', at:5, up:['form', 'lookup', 'research', 'reply'], who:['MK', 'TR'], via:'Slack message', sees:'reply.body', expire:'24 hours', then:'Stop the run', out:[['decision', 'text', 'Approved'], ['by', 'text', 'Maya Kim']] }
  };
  const shut = new Set(['out', 'fail']);
  let k = 'ai', S = STEP.ai, target = null, caret = null, off = false;
  const say = t => { live.textContent = ''; c.later(40, () => { live.textContent = t; }); };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const known = ref => { const [s] = ref.split('.'); return !!SRC[s] && S.up.includes(s); };
  const nameOf = ref => { const [s, f] = ref.split('.'); return (SRC[s] ? SRC[s].t : cap(s)) + ' › ' + f; };
  // a mapped field: the step's tile, the step and the field; one no earlier step gives is red
  const tok = (ref, attrs = '') => { const [s, f] = ref.split('.'), src = SRC[s];
    if (!known(ref)) return `<span class="sti-tok bad"${attrs}>${I('alert', 'xs')}<span class="s">${src ? src.t : cap(s)}</span><span class="sep" aria-hidden="true">›</span><span class="f">${f}</span></span>`;
    return `<span class="sti-tok"${attrs}><span class="sti-ti" data-k="${src.k}" aria-hidden="true">${I(src.ic, 'xs')}</span><span class="s">${src.t}</span><span class="sep" aria-hidden="true">›</span><span class="f">${f}</span></span>`; };
  const ty = t => `<span class="tag ${TY[t]}">${t}</span>`;
  const sec = (id, t, inner, meta = '') => `<div class="sti-sec" data-sec="${id}"><button class="sti-sh" aria-expanded="${!shut.has(id)}" aria-controls="${uid}-${id}" data-sec="${id}">${I('chev-r', 'xs')}<span>${t}</span>${meta}</button><div class="fold${shut.has(id) ? ' shut' : ''}" id="${uid}-${id}"><div><div class="sti-rows">${inner}</div></div></div></div>`;
  const row = (label, v, cls = '') => `<div class="sti-row${cls}"><span class="k">${label}</span><div class="v">${v}</div></div>`;
  const sel = (f, v) => `<button class="sti-sel" data-f="${f}" data-pop=".sti-pk" aria-haspopup="menu" aria-expanded="false" aria-label="${LABEL[f]}: ${v}"><span>${v}</span>${I('chev-d', 'xs')}</button>`;
  const tokB = (f, ref, label) => `<button class="sti-tokb" data-f="${f}" data-pop=".sti-dp" aria-haspopup="menu" aria-expanded="false" aria-label="${label}: ${nameOf(ref)}${known(ref) ? '' : ', which no earlier step gives'}. Change it">${tok(ref)}</button>`;
  const note = ref => known(ref) ? '' : `<p class="sti-note">${cap(ref.split('.')[0])} isn't an earlier step any more. Pick where ${ref.split('.')[1]} comes from.</p>`;
  const insHTML = () => S.ins.map(p => typeof p === 'string' && !/^\w+\.\w+$/.test(p) ? p.replace(/&/g, '&amp;').replace(/</g, '&lt;') : tok(p, ` contenteditable="false" data-ref="${p}"`)).join('');
  const chip = (ic, k, t, x, attr) => `<span class="sti-chip">${k === 'av' ? AV(ic, `var(--av-${PEOPLE[attr][1]})`).replace('<span class="av"', '<span class="av" aria-hidden="true"') : `<span class="sti-ti" data-k="${k}" aria-hidden="true">${I(ic, 'xs')}</span>`}<span>${t}</span><button class="sti-cx" data-x="${attr}" aria-label="Remove ${t}" data-tip="Remove">${I('x', 'xs')}</button></span>`;
  const missing = () => (S.in || []).filter(([, v]) => !known(v)).length;
  const inMeta = () => missing() ? `<span class="tag bad">${missing()} missing</span>` : `<span class="n">${S.in.length} mapped</span>`;
  const outs = () => sec('out', 'Output', S.out.map(([f, t, ex]) => `<div class="sti-out"><span>${f}</span>${ty(t)}<span class="ex">${ex}</span></div>`).join(''), `<span class="n">${S.out.length} ${S.out.length === 1 ? 'field' : 'fields'}</span>`);
  const num = (f, v, lo, hi, label) => `<span class="sti-num" role="group" aria-label="${label}"><button class="ib" data-f="${f}" data-d="-1" aria-label="Fewer ${label.toLowerCase()}" data-tip="Fewer"${v <= lo ? ' aria-disabled="true"' : ''}>${I('minus', 'xs')}</button><span class="num" aria-live="polite">${v}</span><button class="ib" data-f="${f}" data-d="1" aria-label="More ${label.toLowerCase()}" data-tip="More"${v >= hi ? ' aria-disabled="true"' : ''}>${I('plus', 'xs')}</button></span>`;
  const link = id => `<span class="sti-link"><span class="sti-ti" data-k="${SRC[id].k}" aria-hidden="true">${I(SRC[id].ic, 'xs')}</span><span>${SRC[id].t}</span></span>`;
  function render(fresh){
    const T = { ai:'spark', branch:'branch', approval:'user' }[k];
    tile.dataset.k = k; tile.innerHTML = I(T, 's'); r.querySelector('.sti').dataset.k = k;
    nameIn.value = S.n; kd.classList.remove('ok'); kd.textContent = `${KIND[k]}, step ${S.at} of 7`;
    let h = '';
    if (k === 'ai'){
      h += sec('setup', 'Setup', row(LABEL.model, sel('model', S.model))
        + `<div class="sti-insw"><div class="sti-ih"><span class="k" id="${uid}-il">Instructions</span><button class="pill ghost sm sti-insert" data-f="ins" data-pop=".sti-dp" aria-haspopup="menu" aria-expanded="false">${I('plus', 'xs')}Insert data</button></div>`
        + `<div class="sti-ins" contenteditable="true" role="textbox" aria-multiline="true" aria-labelledby="${uid}-il" spellcheck="false">${insHTML()}</div></div>`
        + row('Tools', `<span class="sti-chips">${S.tools.map(t => { const x = TOOLS.find(y => y[0] === t); return chip(x[2], 'tool', x[1], null, t); }).join('')}<button class="sti-add" data-f="tool" data-pop=".sti-pk" aria-haspopup="menu" aria-expanded="false" aria-label="Add a tool" data-tip="Add a tool">${I('plus', 'xs')}</button></span>`, ' top'));
      h += sec('in', 'Inputs', S.in.map(([f, v]) => row(f, tokB('in.' + f, v, f)) + note(v)).join(''), inMeta());
      h += outs();
      h += sec('fail', 'If it fails', row('Retries', num('retries', S.retries, 0, 5, 'Retries'))
        + row('Wait between', `<div class="seg2 sti-seg" role="group" aria-label="Wait between tries" data-f="backoff"><button aria-pressed="${S.backoff === 'fixed'}" data-v="fixed">2s each</button><button aria-pressed="${S.backoff === 'doubling'}" data-v="doubling">Doubling</button></div>`)
        + row(LABEL.limit, sel('limit', S.limit)) + row(LABEL.onfail, sel('onfail', S.onfail)));
    }
    if (k === 'branch'){
      h += sec('setup', 'Takes Yes when', `<div class="sti-rule">${tokB('rule', S.rule.v, 'Value')}${sel('op', S.rule.op)}<input class="sti-in" type="number" inputmode="numeric" min="0" max="100" value="${S.rule.n}" aria-label="Threshold"></div>`
        + row('Yes', link(S.yes)) + row('No', link(S.no)));
      h += outs();
    }
    if (k === 'approval'){
      h += sec('setup', 'Who approves', row('People', `<span class="sti-chips">${S.who.map(w => chip(w, 'av', PEOPLE[w][0], null, w)).join('')}<button class="sti-add" data-f="who" data-pop=".sti-pk" aria-haspopup="menu" aria-expanded="false" aria-label="Add a person" data-tip="Add a person">${I('plus', 'xs')}</button></span>`, ' top')
        + row(LABEL.via, sel('via', S.via)) + row('They see', tokB('sees', S.sees, 'They see')));
      h += sec('exp', 'If nobody answers', row(LABEL.expire, sel('expire', S.expire)) + row(LABEL.then, sel('then', S.then)));
      h += outs();
    }
    body.innerHTML = h; caret = null;
    $$('.sti-seg', body).forEach(g => seg(g, v => { S.backoff = v; say(v === 'doubling' ? 'Waits double between tries' : 'Waits 2 seconds between tries'); }));
    if (fresh && !REDUCE){ body.classList.remove('in'); void body.offsetWidth; body.classList.add('in'); }
  }
  // the switch under the demo picks the kind of step; a pick that isn't the demo's own is the visitor taking over
  let byDemo = false;
  const kseg = $('.demo .seg2', r);
  seg(kseg, v => { if (!byDemo) c.mine = true; if (v === k) return; closePops(); k = v; S = STEP[v]; off = false; paintOff(); render(true); });
  const kindTo = v => { byDemo = true; const b = $(`button[data-v="${v}"]`, kseg); if (b) b.click(); byDemo = false; };
  // the menus are written as they open: a choice's options, the tools, the people, and the data from earlier steps
  const ck = `<span class="ck">${I('check', 'xs')}</span>`;
  function fillPk(b){
    const f = b.dataset.f; target = b;
    if (f === 'tool'){ pk.setAttribute('aria-label', 'Add a tool'); pk.innerHTML = `<div class="ph" role="none">Give ${S.n} a tool</div>` + TOOLS.map(([id, t, ic]) => `<button class="mi" role="menuitem" tabindex="-1" data-tool="${id}" data-close${S.tools.includes(id) ? ' aria-disabled="true"' : ''}><span class="sti-ti" data-k="tool" aria-hidden="true">${I(ic, 'xs')}</span><span>${t}</span></button>`).join(''); return; }
    if (f === 'who'){ pk.setAttribute('aria-label', 'Who approves'); pk.innerHTML = `<div class="ph" role="none">Who approves</div>` + Object.keys(PEOPLE).map(w => `<button class="mi" role="menuitemcheckbox" aria-checked="${S.who.includes(w)}" tabindex="-1" data-w="${w}" data-close>${AV(w, `var(--av-${PEOPLE[w][1]})`)}<span>${PEOPLE[w][0]}</span>${ck}</button>`).join(''); return; }
    const cur = f === 'op' ? S.rule.op : S[f];
    pk.setAttribute('aria-label', LABEL[f]);
    pk.innerHTML = `<div class="ph" role="none">${LABEL[f]}</div>` + OPTS[f].map(([v, d]) => `<button class="mi" role="menuitemradio" aria-checked="${v === cur}" tabindex="-1" data-v="${v}" data-close><span>${v}${d ? `<span class="d">${d}</span>` : ''}</span>${ck}</button>`).join('');
  }
  function fillDp(b){
    target = b; const f = b.dataset.f, cur = f === 'ins' ? null : f === 'rule' ? S.rule.v : f === 'sees' ? S.sees : (S.in.find(x => 'in.' + x[0] === f) || [])[1];
    dp.innerHTML = S.up.map(s => { const src = SRC[s]; return `<div role="group" aria-label="${src.t}"><div class="ph" role="none"><span class="sti-ti" data-k="${src.k}" aria-hidden="true">${I(src.ic, 'xs')}</span>${src.t}</div>`
      + src.out.map(([fd, t, ex]) => `<button class="mi" role="menuitemradio" aria-checked="${s + '.' + fd === cur}" tabindex="-1" data-ref="${s}.${fd}" data-close><span>${fd}</span>${ty(t)}<span class="r">${ex}</span></button>`).join('') + '</div>'; }).join('');
  }
  // what the instructions say, read back from the box: its text, and its tokens as references
  const readIns = el => { const out = []; el.childNodes.forEach(n => { if (n.nodeType === 3) out.push(n.textContent); else if (n.dataset && n.dataset.ref) out.push(n.dataset.ref); else if (n.nodeName === 'BR') out.push('\n'); else out.push('\n' + n.textContent); }); return out; };
  function insertTok(ref){
    const box = $('.sti-ins', body); if (!box) return;
    const t = html(tok(ref, ` contenteditable="false" data-ref="${ref}"`)); t.classList.add('new');
    const sp = document.createTextNode(' ');
    if (caret && box.contains(caret.startContainer)){ caret.collapse(false); caret.insertNode(sp); caret.insertNode(t); }
    else { if (box.lastChild && box.lastChild.nodeType === 3 && !/\s$/.test(box.lastChild.textContent)) box.appendChild(document.createTextNode(' ')); box.append(t, sp); }
    S.ins = readIns(box);
  }
  function map(f, ref){
    if (f === 'ins'){ insertTok(ref); say(`Inserted ${nameOf(ref)} into the instructions`); return; }
    if (f === 'rule') S.rule.v = ref; else if (f === 'sees') S.sees = ref; else { const x = S.in.find(y => 'in.' + y[0] === f); if (x) x[1] = ref; }
    const b = $(`.sti-tokb[data-f="${f}"]`, body); if (!b) return;
    const label = f === 'rule' ? 'Value' : f === 'sees' ? 'They see' : f.slice(3);
    b.outerHTML = tokB(f, ref, label);
    const nb = $(`.sti-tokb[data-f="${f}"]`, body), n = nb.closest('.sti-row').nextElementSibling;
    if (n && n.classList.contains('sti-note')) n.remove();
    if (!known(ref)) nb.closest('.sti-row').insertAdjacentHTML('afterend', note(ref));
    enter($('.sti-tok', nb));
    const m = $('.sti-sec[data-sec="in"] .sti-sh', body); if (m){ $$('.tag, .n', m).forEach(x => x.remove()); m.insertAdjacentHTML('beforeend', inMeta()); }
    say(`${label} now reads ${nameOf(ref)}`);
  }
  c.on(document, 'selectionchange', () => { const s = getSelection(), box = $('.sti-ins', body); if (s.rangeCount && box && box.contains(s.anchorNode)) caret = s.getRangeAt(0).cloneRange(); });
  c.on(body, 'input', e => { if (e.target.matches('.sti-ins')) S.ins = readIns(e.target); if (e.target.matches('.sti-in')) S.rule.n = Math.max(0, Math.min(100, +e.target.value || 0)); });
  // Enter starts a new line in the instructions as plain text, so the box never fills with markup
  c.on(body, 'keydown', e => { if (e.key !== 'Enter' || !e.target.matches('.sti-ins')) return; e.preventDefault(); const s = getSelection(); if (!s.rangeCount) return; const rg = s.getRangeAt(0); rg.deleteContents(); const nl = document.createTextNode('\n'); rg.insertNode(nl); rg.setStartAfter(nl); rg.collapse(true); s.removeAllRanges(); s.addRange(rg); S.ins = readIns(e.target); });
  c.on(r, 'click', e => {
    const b = e.target.closest('button'); if (!b || !r.contains(b)) return;
    if (b.matches('[data-pop=".sti-pk"]')) return fillPk(b);
    if (b.matches('[data-pop=".sti-dp"]')) return fillDp(b);
    if (b.dataset.sec){ const f = b.nextElementSibling, open = f.classList.toggle('shut') === false; b.setAttribute('aria-expanded', String(open)); open ? shut.delete(b.dataset.sec) : shut.add(b.dataset.sec); return; }
    if (b.dataset.d){ if (b.getAttribute('aria-disabled') === 'true') return; const v = Math.max(0, Math.min(5, S.retries + +b.dataset.d)); S.retries = v; const g = b.closest('.sti-num'); $('.num', g).textContent = v;
      $$('.ib', g).forEach(x => { const lo = +x.dataset.d < 0 ? v <= 0 : v >= 5; lo ? x.setAttribute('aria-disabled', 'true') : x.removeAttribute('aria-disabled'); }); return; }
    if (b.matches('.sti-cx')){ const x = b.dataset.x;
      if (k === 'ai'){ S.tools = S.tools.filter(t => t !== x); say(`Removed ${TOOLS.find(t => t[0] === x)[1]}`); }
      else { if (S.who.length < 2){ say('Someone has to approve. Add another person first'); return; } S.who = S.who.filter(w => w !== x); say(`Removed ${PEOPLE[x][0]}`); }
      const ch = b.closest('.sti-chip'), add = ch.parentElement.querySelector('.sti-add'); ch.remove(); if (e.isTrusted && add) add.focus({ preventScroll:true }); return; }
    if (b.closest('.sti-pk') && b.matches('.mi')){
      if (b.getAttribute('aria-disabled') === 'true') return;
      const f = target && target.dataset.f;
      if (b.dataset.tool){ S.tools.push(b.dataset.tool); const x = TOOLS.find(t => t[0] === b.dataset.tool), add = $('.sti-add[data-f="tool"]', body); add.insertAdjacentHTML('beforebegin', chip(x[2], 'tool', x[1], null, x[0])); enter(add.previousElementSibling); say(`${S.n} can use ${x[1]}`); return; }
      if (b.dataset.w){ const w = b.dataset.w, add = $('.sti-add[data-f="who"]', body);
        if (S.who.includes(w)){ if (S.who.length < 2) return say('Someone has to approve'); S.who = S.who.filter(x => x !== w); const ch = $(`.sti-cx[data-x="${w}"]`, body); if (ch) ch.closest('.sti-chip').remove(); say(`Removed ${PEOPLE[w][0]}`); return; }
        S.who.push(w); add.insertAdjacentHTML('beforebegin', chip(w, 'av', PEOPLE[w][0], null, w)); enter(add.previousElementSibling); say(`${PEOPLE[w][0]} can approve`); return; }
      const v = b.dataset.v; if (f === 'op') S.rule.op = v; else S[f] = v;
      if (target && target.isConnected){ $('span', target).textContent = v; target.setAttribute('aria-label', `${LABEL[f]}: ${v}`); }
      say(`${LABEL[f]}: ${v}`); return;
    }
    if (b.closest('.sti-dp') && b.dataset.ref){ if (target) map(target.dataset.f, b.dataset.ref); return; }
    if (b.closest('.sti-mm')){ if (b.dataset.a === 'rename') setTimeout(() => { nameIn.focus(); nameIn.select(); }, 140); if (b.dataset.a === 'off'){ off = !off; paintOff(); say(off ? `${S.n} is off. Runs skip it` : `${S.n} is on`); } return; }
  });
  function paintOff(){ const t = $('.sti-off', nr); if (off && !t) nr.insertAdjacentHTML('beforeend', '<span class="tag sti-off">Off</span>'); if (!off && t) t.remove();
    const m = $('[data-a="off"]', mm); m.innerHTML = `${I(off ? 'play' : 'pause', 's')}<span>${off ? 'Turn on' : 'Turn off'}</span>`; }
  // the name saves as it is typed; Escape puts back the name it had when the field took the focus
  let was = S.n;
  c.on(nameIn, 'focus', () => { was = S.n; });
  c.on(nameIn, 'input', () => { S.n = nameIn.value; });
  c.on(nameIn, 'keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); nameIn.blur(); } if (e.key === 'Escape'){ nameIn.value = S.n = was; nameIn.blur(); } });
  c.on(nameIn, 'blur', () => { if (!nameIn.value.trim()){ nameIn.value = S.n = KIND[k]; } });
  // Test runs the step on its own with sample data, and says how it went
  let testing = 0;
  c.on(testB, 'click', () => {
    if (testing) return; const id = ++testing; testB.classList.add('busy'); testB.innerHTML = I('refresh', 's'); swap(kd, 'Testing with sample data'); kd.classList.remove('ok');
    c.later(1400, () => { if (testing !== id) return; testing = 0; testB.classList.remove('busy'); testB.innerHTML = I('play', 's'); kd.classList.add('ok'); swap(kd, 'Worked in 1.4s, with sample data'); say(`${S.n} worked in 1.4 seconds`);
      c.later(3200, () => { if (!testing){ kd.classList.remove('ok'); swap(kd, `${KIND[k]}, step ${S.at} of 7`); } }); });
  });
  render(false);
  // the preview's story: insert a field into the instructions, fix the input that points at a step that is gone, give the
  // step a second retry, then look at a branch's rule and add a person to an approval
  c.story(async s => {
    await s.beat(3);
    await s.tap($('.sti-insert', r)); await s.beat(1.6);
    await s.tap($('.sti-dp .mi[data-ref="lookup.industry"]', r)); await s.beat(2.4);
    await s.tap($('.sti-tokb[data-f="in.email"]', r)); await s.beat(1.6);
    await s.tap($('.sti-dp .mi[data-ref="form.email"]', r)); await s.beat(2.4);
    await s.tap($('.sti-sh[data-sec="fail"]', r)); await s.beat(1.4);
    await s.tap($('.sti-num [data-d="1"]', r)); await s.beat(2.4);
    s.away(); kindTo('branch'); await s.beat(2.4);
    await s.point($('.sti-in', r), false); await s.beat(2.4);
    s.away(); kindTo('approval'); await s.beat(2);
    await s.tap($('.sti-add[data-f="who"]', r)); await s.beat(1.4);
    await s.tap($('.sti-pk .mi[data-w="JB"]', r)); await s.beat(2.4);
  });
});
/* ---------- Data picker ---------- */
DM.def('data-picker', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)(?:\.(xs))?\}/g, (m, k, z) => I(k, z || 's'));
  const uid = 'fpk' + Math.random().toString(36).slice(2, 7);
  const box = $('.fpk', r), pop = $('.fpk-pop', r), q = $('.fpk-q input', r), ls = $('.fpk-ls', r), live = $('.fpk-live', r);
  // each data type has its colour: text blue, numbers green, lists orange, objects pink, yes or no yellow, dates teal
  const TY = { text:'b', number:'m', list:'p', object:'k', bool:'y', date:'t' };
  // the steps before Send the reply, in their order, and what each hands on: [field, type, sample]
  const S = [
    { id:'form', t:'Demo request form', k:'trigger', ic:'file-text', f:[['name', 'text', 'Priya Shah'], ['email', 'text', 'priya@corvid.io'], ['company', 'text', 'Corvid Analytics'], ['seats', 'number', '240'], ['sent_at', 'date', 'Nov 8, 10:41']] },
    { id:'lookup', t:'Company lookup', k:'tool', ic:'globe', f:[['employees', 'number', '420'], ['industry', 'text', 'Analytics software'], ['verified', 'bool', 'true']] },
    { id:'research', t:'Research and score', k:'ai', ic:'spark', f:[['score', 'number', '84'], ['tier', 'text', 'Enterprise'], ['reasons', 'list', '3 reasons'], ['company', 'object', '{ 5 fields }']] },
    { id:'reply', t:'Draft a reply', k:'ai', ic:'edit', f:[['subject', 'text', 'Your demo with Fernhill'], ['body', 'text', 'Hi Priya, thanks for writing']] }
  ];
  const F = { to:{ l:'To', v:['form.email'] }, subject:{ l:'Subject', v:['reply.subject', 'form.company'] }, body:{ l:'Body', v:['reply.body'] } };
  let target = null, items = [], hi = 0;
  ls.id = uid + '-ls'; q.setAttribute('aria-controls', ls.id);
  const say = t => { live.textContent = ''; c.later(40, () => { live.textContent = t; }); };
  const of = ref => { const [s, f] = ref.split('.'); return { st:S.find(x => x.id === s), f }; };
  const tokHTML = ref => { const { st, f } = of(ref);
    return `<span class="fpk-tok" data-ref="${ref}"><span class="fpk-ti" data-k="${st.k}" aria-hidden="true">${I(st.ic, 'xs')}</span><span class="s">${st.t}</span><span class="sep" aria-hidden="true">›</span><span class="f">${f}</span><button class="fpk-x" aria-label="Remove ${f} from ${st.t}" data-tip="Remove">${I('x', 'xs')}</button></span>`; };
  const addB = k => `<button class="fpk-add" data-f="${k}" data-pop=".fpk-pop" data-pop-pos="down" data-pop-align="end" aria-haspopup="dialog" aria-expanded="false" aria-label="Insert data into ${F[k].l}" data-tip="Insert data">${I('plus', 's')}</button>`;
  const paintField = k => { $(`.fpk-f[data-f="${k}"] .fpk-box`, r).innerHTML = (F[k].v.length ? F[k].v.map(tokHTML).join('') : '<span class="fpk-ph">Pick data from an earlier step</span>') + addB(k); };
  Object.keys(F).forEach(paintField);
  const mark = (t, v) => { const i = v ? t.toLowerCase().indexOf(v) : -1; return i < 0 ? t : t.slice(0, i) + '<mark>' + t.slice(i, i + v.length) + '</mark>' + t.slice(i + v.length); };
  function paint(){
    const v = q.value.trim().toLowerCase(); let h = '', n = 0; items = [];
    S.forEach((st, si) => {
      const fs = st.f.filter(([f]) => !v || f.toLowerCase().includes(v) || st.t.toLowerCase().includes(v)); if (!fs.length) return;
      h += `<div role="group" aria-labelledby="${uid}-g${si}"><div class="fpk-g" id="${uid}-g${si}"><span class="fpk-ti" data-k="${st.k}" aria-hidden="true">${I(st.ic, 'xs')}</span><b>${st.t}</b><span class="n">Step ${si + 1}</span></div>`
        + fs.map(([f, t, ex]) => { const ref = st.id + '.' + f, i = n++; items.push(ref);
          return `<div class="fpk-o" role="option" id="${uid}-o${i}" aria-selected="false" data-i="${i}" aria-label="${f}, ${t}, from ${st.t}"><span class="k">${mark(f, v)}</span><span class="tag ${TY[t]}">${t}</span><span class="ex">${ex}</span></div>`; }).join('') + '</div>';
    });
    ls.innerHTML = h || `<p class="fpk-e">No field matches “${q.value.trim().replace(/</g, '&lt;')}”</p>`;
    hi = 0; move(0);
  }
  function move(d){
    const os = $$('.fpk-o', ls); if (!os.length){ q.removeAttribute('aria-activedescendant'); return; }
    hi = (hi + d + os.length) % os.length;
    os.forEach((o, i) => { o.classList.toggle('on', i === hi); o.setAttribute('aria-selected', String(i === hi)); });
    q.setAttribute('aria-activedescendant', os[hi].id); os[hi].scrollIntoView({ block:'nearest' });
  }
  function pick(i){
    const ref = items[i]; if (!ref || !target) return; const k = target, { st, f } = of(ref);
    closePops();
    if (F[k].v.includes(ref)){ say(`${F[k].l} already has ${f} from ${st.t}`); return; }
    F[k].v.push(ref);
    const bx = $(`.fpk-f[data-f="${k}"] .fpk-box`, r), add = $('.fpk-add', bx), ph = $('.fpk-ph', bx); if (ph) ph.remove();
    add.insertAdjacentHTML('beforebegin', tokHTML(ref)); if (!REDUCE) add.previousElementSibling.classList.add('new');
    say(`Added ${f} from ${st.t} to ${F[k].l}`);
  }
  function remove(tk, mine){
    const k = tk.closest('.fpk-f').dataset.f, ref = tk.dataset.ref, { st, f } = of(ref), add = $('.fpk-add', tk.parentElement);
    F[k].v = F[k].v.filter(x => x !== ref);
    tk.classList.add('out'); tk.inert = true;
    setTimeout(() => { tk.remove(); if (!F[k].v.length) add.insertAdjacentHTML('beforebegin', '<span class="fpk-ph">Pick data from an earlier step</span>'); }, REDUCE ? 0 : 280);
    if (mine) add.focus({ preventScroll:true });
    say(`Removed ${f} from ${st.t}`);
  }
  // the picker opens from a field's +, on that field's data; a click puts the focus in its search
  c.on(r, 'click', e => {
    const b = e.target.closest('button');
    if (b && b.matches('.fpk-add')){ target = b.dataset.f; pop.setAttribute('aria-label', `Pick data for ${F[target].l}`); q.value = ''; paint(); if (e.isTrusted) setTimeout(() => { if (pop.classList.contains('open')) q.focus({ preventScroll:true }); }, 30); return; }
    if (b && b.matches('.fpk-x')){ remove(b.closest('.fpk-tok'), e.isTrusted); return; }
    const o = e.target.closest('.fpk-o'); if (o) pick(+o.dataset.i);
  });
  c.on(ls, 'pointermove', e => { const o = e.target.closest('.fpk-o'); if (o && +o.dataset.i !== hi){ hi = +o.dataset.i; move(0); } });
  c.on(q, 'input', paint);
  // in the search the arrows move through the fields and wrap, Enter puts the one picked in, Escape closes (the core)
  c.on(q, 'keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); move(e.key === 'ArrowDown' ? 1 : -1); } else if (e.key === 'Enter'){ e.preventDefault(); pick(hi); } });
  // the fields sit centred, and glide up as the picker opens under one of them
  const centred = centre(c, box, () => pop.classList.contains('open') ? Math.max(box.offsetHeight, pop.offsetTop + pop.offsetHeight) : box.offsetHeight);
  const mo = new MutationObserver(() => { if (pop.classList.contains('open')) centred(); else c.later(REDUCE ? 0 : 180, centred); });
  mo.observe(pop, { attributes:true, attributeFilter:['class'] }); c.offs.push(() => mo.disconnect());
  // the preview's story: take a field out of the subject, then open Body's picker, search for "sc" (the score, and every
  // field of Research and score), move down to the reasons with the arrows and put them in
  c.story(async s => {
    await s.beat(3);
    await s.tap($('.fpk-tok[data-ref="form.company"] .fpk-x', r)); await s.beat(2);
    await s.tap($('.fpk-add[data-f="body"]', r)); await s.beat(1.4);
    await s.type(q, 'sc', { each:paint, n:.3 }); await s.beat(1.2);
    for (let i = 0; i < 2; i++){ move(1); await s.beat(.8); }
    await s.beat(.6); await s.tap($('.fpk-o.on', r)); await s.beat(2.4);
  });
});
/* ---------- Run drawer ---------- */
DM.def('run-drawer', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)(?:\.(xs))?\}/g, (m, k, z) => I(k, z || 's'));
  const uid = 'rdr' + Math.random().toString(36).slice(2, 7);
  const frame = $('.rdr', r), dw = $('.rdr-dw', r), flow = $('.rdr-flow', r), tg = $('.rdr-tg', r), stT = $('.rdr-st', r), idT = $('.rdr-id', r), meta = $('.rdr-meta', r);
  const bd = $('.rdr-b', r), rowsEl = $('.rdr-rows', r), sc = $('.rdr-sc', r), logEl = $('.rdr-log', r), cnt = $('.rdr-lf .n', r), ds = $('.rdr-ds', r), io = $('.rdr-io', r);
  const stopB = $('.rdr-stop', r), againB = $('.rdr-again', r), followB = $('.rdr-follow', r), grip = $('.rdr-grip', r), live = $('.rdr-live', r);
  bd.id = uid + '-b'; tg.setAttribute('aria-controls', bd.id);
  // the workflow: each step with what it took in and handed on; an AI step's model and tool calls are its kids, as
  // [kind, name, icon, seconds, tokens, error]; the lookup is rate limited once, so it waits and tries again
  const STEPS = [
    { id:'form', t:'Demo request form', k:'trigger', ic:'file-text', d:.25, in:{ source:'Website form', form:'Book a demo' }, out:{ name:'Priya Shah', email:'priya@corvid.io', company:'Corvid Analytics', seats:240 }, log:['debug', 'New submission from priya@corvid.io'] },
    { id:'research', t:'Research and score', k:'ai', ic:'spark', in:{ company:'Corvid Analytics', email:'priya@corvid.io', seats:240 }, out:{ score:84, tier:'Enterprise', reasons:['Asked for 240 seats', 'Support team use case', 'Series B and hiring'] }, log:['info', 'Scored 84, Enterprise'],
      kids:[['model', 'Sonnet 5.5, reads the input', 'spark', .6, 380], ['tool', 'Company lookup', 'globe', 1.5, 0, '429 Too many requests'], ['retry', 'Wait 2s, then try again', 'refresh', 2], ['tool', 'Company lookup, try 2', 'globe', .7], ['model', 'Sonnet 5.5, writes the score', 'spark', 1.25, 1240]] },
    { id:'fit', t:'Good fit?', k:'branch', ic:'branch', d:.1, in:{ score:84, rule:'score is at least 70' }, out:{ path:'Yes' }, log:['info', 'score is 84, at least 70, so it took Yes'] },
    { id:'reply', t:'Draft a reply', k:'ai', ic:'edit', in:{ name:'Priya Shah', reasons:'3 reasons' }, out:{ subject:'Your demo with Fernhill', body:'Hi Priya, thanks for reaching out about 240 seats.' }, log:['info', 'Drafted "Your demo with Fernhill"'],
      kids:[['model', 'Sonnet 5.5, writes the reply', 'spark', 1.2, 980]] },
    { id:'approve', t:'Rep approves', k:'approval', ic:'user', ask:'Maya Kim or Theo Reed', in:{ ask:['Maya Kim', 'Theo Reed'], via:'Slack message', shows:'reply.body' }, out:{ decision:'Approved', by:'You' } },
    { id:'send', t:'Send the reply', k:'app', ic:'mail', d:.55, in:{ to:'priya@corvid.io', subject:'Your demo with Fernhill' }, out:{ message_id:'msg_8f2c41', sent:true }, log:['info', 'Sent to priya@corvid.io'] },
    { id:'post', t:'Post to Slack', k:'output', ic:'hash', d:.4, in:{ channel:'#inbound-leads', text:'Priya Shah at Corvid Analytics scored 84' }, out:{ ts:'1731062520.4' }, log:['info', 'Posted to #inbound-leads'] }
  ];
  const byId = id => STEPS.find(x => x.id === id);
  flow.innerHTML = STEPS.map((x, i) => (i ? '<span class="rdr-wire" aria-hidden="true"></span>' : '') + `<button class="rdr-nd" data-s="${x.id}" aria-pressed="false" aria-label="${x.t}" data-tip="${x.t}"><span class="rdr-ti" data-k="${x.k}" aria-hidden="true">${I(x.ic, 'xs')}</span><span class="t">${x.t}</span><span class="rdr-ns" aria-hidden="true">${I('check', 'xs')}</span></button>`).join('');
  let run = 2087, R = null, tab = 'steps', lvl = 'all', follow = true, picked = null, last = 0;
  const say = t => { live.textContent = ''; c.later(40, () => { live.textContent = t; }); };
  const secs = v => (v < 10 ? v.toFixed(1) : Math.round(v)) + 's';
  const stamp = v => { const m = Math.floor(v / 60), s = v - m * 60; return String(m).padStart(2, '0') + ':' + s.toFixed(2).padStart(5, '0'); };
  // a run: its spans (one per step and per model or tool call) and its log, planned up to the step that waits for a person
  function plan(from, t0){
    for (let i = from; i < STEPS.length; i++){
      const x = STEPS[i];
      if (x.ask){ R.sp.push({ s:x.id, t:x.t, k:x.k, ic:x.ic, lv:0, a:t0, e:null, st:'wait' }); R.log.push({ at:t0, l:'warn', b:x.t, m:`Waiting for ${x.ask}` }); R.pause = { i, at:t0 }; return; }
      if (!x.kids){ R.sp.push({ s:x.id, t:x.t, k:x.k, ic:x.ic, lv:0, a:t0, e:t0 + x.d, st:'ok' }); t0 += x.d; R.log.push({ at:t0, l:x.log[0], b:x.t, m:x.log[1] }); continue; }
      const p = { s:x.id, t:x.t, k:x.k, ic:x.ic, lv:0, a:t0, e:null, st:'ok' }; R.sp.push(p);
      for (const [k, t, ic, d, tok, err] of x.kids){
        R.sp.push({ s:x.id, t, k, ic, lv:1, a:t0, e:t0 + d, st:err ? 'bad' : 'ok', tok, err });
        if (k === 'model') R.log.push({ at:t0 + d, l:'debug', b:t, m:`${tok.toLocaleString('en-US')} tokens` });
        if (err) R.log.push({ at:t0 + d, l:'error', b:t, m:err });
        if (k === 'retry') R.log.push({ at:t0, l:'warn', b:'Company lookup', m:'Trying again in 2s, try 2 of 2' });
        if (k === 'tool' && !err) R.log.push({ at:t0 + d, l:'info', b:'Company lookup', m:'Found Corvid Analytics on try 2' });
        t0 += d;
      }
      p.e = t0; R.log.push({ at:t0, l:x.log[0], b:x.t, m:x.log[1] });
    }
    R.end = t0; R.log.push({ at:t0, l:'info', b:'Run passed', m:`${secs(t0)}, 1 retry` });
  }
  function start(){
    R = { id:++run, t:0, st:'run', sp:[], log:[], pause:null, end:null, rows:new Map(), logN:0 };
    R.log.push({ at:0, l:'info', b:'Run started', m:'Test run with Priya Shah, Corvid Analytics' });
    plan(0, 0); rowsEl.innerHTML = ''; logEl.innerHTML = ''; picked = null; idT.textContent = '#' + R.id;
    stopB.hidden = false; againB.hidden = true; paint(true); say(`Test run #${R.id} started`);
  }
  const node = id => $(`.rdr-nd[data-s="${id}"]`, flow);
  function stateOf(sp, t){ if (sp.st === 'stop') return 'stop'; if (sp.e == null) return R.st === 'stopped' ? 'stop' : sp.st; return t < sp.e ? (sp.k === 'retry' ? 'retry' : 'run') : sp.st; }
  // the canvas, the timeline, the log, the data and the head all follow the run's clock
  function paint(force){
    const t = R.t, sps = R.sp.filter(x => x.a <= t + 1e-6);
    // the steps on the canvas: the one under way ringed, a retry or a wait amber, done ones ticked
    STEPS.forEach((x, i) => {
      const mine = sps.filter(p => p.s === x.id), main = mine.find(p => p.lv === 0);
      let st = '';
      if (main){ const ms = stateOf(main, t);
        if (ms === 'run'){ const cur = mine.filter(p => p.lv === 1).pop(); st = cur && (cur.k === 'retry' || (cur.st === 'bad' && t >= cur.e)) ? 'retry' : 'run'; } else st = ms; }
      const el = node(x.id); if (el.dataset.st !== st){ el.dataset.st = st; if (st === 'run' && follow && R.st === 'run'){ const l = el.offsetLeft - flow.clientWidth / 2 + el.offsetWidth / 2; flow.scrollTo({ left:l, behavior:REDUCE ? 'auto' : 'smooth' }); } }
      const w = el.previousElementSibling; if (w) w.classList.toggle('done', !!main);
    });
    // the timeline's axis grows with the run
    const span = Math.max(10, Math.ceil((t + .5) / 2) * 2), wpx = sc.clientWidth || 240, step = [2, 5, 10, 20].find(x => span / x * 34 <= wpx) || 20;
    const key = span * 100 + step; if (key !== R.ax){ R.ax = key; rowsEl.style.setProperty('--rdr-g', (step / span * 100) + '%'); sc.innerHTML = Array.from({ length:Math.floor(span / step) }, (_, i) => `<span style="left:${i * step / span * 100}%">${i * step}s</span>`).join(''); }
    sps.forEach(p => {
      let el = R.rows.get(p);
      if (!el){
        el = html(`<button class="rdr-r" data-s="${p.s}" data-k="${p.k}" data-lv="${p.lv}" style="--lv:${p.lv}" aria-pressed="${p.s === picked}"><span class="rdr-n"><span class="rdr-ti" data-k="${p.k}" aria-hidden="true">${I(p.ic, 'xs')}</span><span class="rdr-nm">${p.t}</span></span><span class="rdr-bt"><i></i></span><span class="rdr-ms num"></span></button>`);
        R.rows.set(p, el); rowsEl.appendChild(el); if (!force && !REDUCE) el.classList.add('in');
      }
      const st = stateOf(p, t), e = p.e == null ? t : Math.min(p.e, t);
      el.dataset.st = st; el.classList.toggle('run', st === 'run');
      const i = $('.rdr-bt i', el); i.style.left = (p.a / span * 100) + '%'; i.style.width = Math.max(.6, (e - p.a) / span * 100) + '%';
      $('.rdr-ms', el).textContent = st === 'wait' ? 'Waiting' : st === 'bad' && p.e != null ? 'Failed' : st === 'stop' ? 'Stopped' : secs(e - p.a);
      el.setAttribute('aria-label', `${p.t}, ${{ run:'running', retry:'waiting to try again', wait:'waiting for approval', bad:'failed', stop:'stopped', ok:'done' }[st]}, ${secs(e - p.a)}`);
    });
    // a person's yes, under the step that waits for it
    const ask = $('.rdr-ask', rowsEl);
    if (R.st === 'wait' && !ask){ const p = R.sp[R.sp.length - 1], x = byId(p.s), el = R.rows.get(p);
      if (el) el.insertAdjacentHTML('afterend', `<div class="rdr-ask${REDUCE ? '' : ' in'}" role="group" aria-label="${x.t} waits for you"><span class="rdr-ti" data-k="approval" aria-hidden="true">${I('user', 'xs')}</span><span class="tx"><b>${x.t} is waiting for you</b><span>Live runs ask ${x.ask} in Slack. In a test, you decide.</span></span><span class="acts"><button class="pill primary sm" data-a="yes">${I('check', 'xs')}Approve</button><button class="pill line sm" data-a="no">Reject</button></span></div>`); }
    if (R.st !== 'wait' && ask) ask.remove();
    // the log, a line at a time, its levels in colour
    const L = R.log.filter(l => l.at <= t + 1e-6).sort((a, b) => a.at - b.at);
    for (; R.logN < L.length; R.logN++){ const l = L[R.logN];
      const li = html(`<li class="rdr-l" data-l="${l.l}"><span class="t num">${stamp(l.at)}</span><span class="lv tag" data-l="${l.l}">${l.l}</span><span class="m"><b>${l.b}</b> <span>${l.m}</span></span></li>`);
      li.hidden = lvl !== 'all' && l.l !== lvl; logEl.appendChild(li); if (!force && !REDUCE && !li.hidden) li.classList.add('in'); }
    filterLog(false);
    // the newest line in view while the run is followed
    if (follow && (R.st === 'run' || R.st === 'wait' || force)){ if (tab === 'steps'){ const b = rowsEl.lastElementChild; if (b && b.offsetTop + b.offsetHeight > bd.scrollTop + bd.clientHeight) bd.scrollTop = b.offsetTop + b.offsetHeight - bd.clientHeight + 6; } if (tab === 'log') bd.scrollTop = bd.scrollHeight; }
    // the head: the run's state, its time, tokens and cost
    const tag = { run:['run', '<span class="spin"></span>Running'], wait:['warn', 'Waiting'], ok:['ok', 'Passed'], bad:['bad', 'Failed'], stopped:['', 'Stopped'] }[R.st];
    if (stT.dataset.s !== R.st){ stT.dataset.s = R.st; stT.className = 'rdr-st tag ' + tag[0]; stT.innerHTML = tag[1]; }
    const tok = Math.round(R.sp.filter(p => p.tok && p.a <= t).reduce((n, p) => n + p.tok * Math.min(1, (t - p.a) / (p.e - p.a)), 0));
    meta.textContent = [secs(t), tok ? `${(tok / 1000).toFixed(1)}k tokens` : '', tok ? `$${(tok * .0000045).toFixed(3)}` : ''].filter(Boolean).join(', ');
    if (tab === 'data' && (force || Math.floor(t * 2) !== R.dq)){ R.dq = Math.floor(t * 2); paintData(); }
  }
  function filterLog(anim){ let n = 0; $$('.rdr-l', logEl).forEach(li => { const show = lvl === 'all' || li.dataset.l === lvl; if (li.hidden === show){ li.hidden = !show; if (show && anim && !REDUCE){ li.classList.remove('in'); void li.offsetWidth; li.classList.add('in'); } } if (show) n++; });
    cnt.textContent = `${n} ${n === 1 ? 'line' : 'lines'}`;
    let e = $('.rdr-le', logEl.parentElement); if (!n && !e){ logEl.insertAdjacentHTML('afterend', `<p class="rdr-le">No ${lvl === 'warn' ? 'warnings' : 'errors'} in this run.</p>`); } if (n && e) e.remove(); }
  // the data each finished step took in and handed on, as JSON
  const json = o => JSON.stringify(o, null, 2).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/("[^"]*")(\s*:)?|\b(-?\d+(?:\.\d+)?|true|false|null)\b/g, (m, s, colon, n) => s ? (colon ? `<span class="k">${s}</span>${colon}` : `<span class="s">${s}</span>`) : `<span class="n">${n}</span>`);
  function paintData(){
    const t = R.t, done = STEPS.filter(x => R.sp.some(p => p.s === x.id && p.lv === 0 && p.e != null && p.e <= t + 1e-6 && p.st === 'ok'));
    if (!done.length){ ds.innerHTML = ''; io.innerHTML = '<p class="rdr-de">No step has finished yet.</p>'; return; }
    const cur = done.find(x => x.id === picked) || done[done.length - 1];
    ds.innerHTML = done.map(x => `<button data-s="${x.id}" aria-pressed="${x === cur}"><span class="rdr-ti" data-k="${x.k}" aria-hidden="true">${I(x.ic, 'xs')}</span><span>${x.t}</span></button>`).join('');
    const out = x => x.id === 'approve' ? { decision:R.ok === false ? 'Rejected' : 'Approved', by:'You' } : x.out;
    io.innerHTML = `<h4>Input</h4><pre class="rdr-json" tabindex="0" aria-label="${cur.t} input">${json(cur.in)}</pre><h4>Output</h4><pre class="rdr-json" tabindex="0" aria-label="${cur.t} output">${json(out(cur))}</pre>`;
  }
  const pick = id => { picked = id; $$('.rdr-r', rowsEl).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.s === id))); $$('.rdr-nd', flow).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.s === id))); if (tab === 'data') paintData(); };
  function decide(ok){
    if (!R || R.st !== 'wait') return; const p = R.sp[R.sp.length - 1], x = byId(p.s); p.e = R.t; p.st = ok ? 'ok' : 'bad';
    if (ok){ R.log.push({ at:R.t, l:'info', b:x.t, m:'Approved by you' }); R.st = 'run'; R.ok = true; plan(R.pause.i + 1, R.t); R.pause = null; say(`${x.t}: approved. The run carries on`); }
    else { R.ok = false; R.log.push({ at:R.t, l:'error', b:x.t, m:'Rejected by you. Nothing was sent' }); R.st = 'bad'; R.end = R.t; finish(); }
    paint();
  }
  function finish(){ stopB.hidden = true; againB.hidden = false; say(R.st === 'ok' ? `Test run passed in ${secs(R.t)}` : R.st === 'bad' ? 'Test run failed' : 'Run stopped'); }
  // the run's clock, at the pace of a real one; while a step waits for a person the clock runs on and its bar grows
  c.loop(ts => {
    const dt = last ? Math.min(.1, (ts - last) / 1000) : 0; last = ts;
    if (!R || (R.st !== 'run' && R.st !== 'wait')) return;
    R.t += dt;
    if (R.st === 'wait'){ paint(); return; }
    if (R.pause && R.t >= R.pause.at){ R.t = R.pause.at; R.st = 'wait'; say(`${byId(R.sp[R.sp.length - 1].s).t} is waiting for you to approve`); }
    if (R.end != null && R.t >= R.end){ R.t = R.end; R.st = 'ok'; paint(); finish(); return; }
    paint();
  });
  c.on(stopB, 'click', () => { if (!R || (R.st !== 'run' && R.st !== 'wait')) return;
    R.sp = R.sp.filter(p => p.a <= R.t); R.sp.forEach(p => { if (p.e == null || p.e > R.t){ p.e = R.t; p.st = 'stop'; } });
    R.log = R.log.filter(l => l.at <= R.t); R.log.push({ at:R.t, l:'warn', b:'Run stopped', m:`You stopped it at ${secs(R.t)}` }); R.st = 'stopped'; R.pause = null; R.end = R.t; paint(); finish(); if (againB) againB.focus({ preventScroll:true }); });
  c.on(againB, 'click', e => { start(); if (e.isTrusted) stopB.focus({ preventScroll:true }); });
  c.on(r, 'click', e => {
    const a = e.target.closest('.rdr-ask [data-a]'); if (a) return decide(a.dataset.a === 'yes');
    const b = e.target.closest('.rdr-r, .rdr-nd, .rdr-ds button'); if (!b) return;
    pick(b.dataset.s);
    if (b.matches('.rdr-nd') && tab === 'steps'){ const row = $(`.rdr-r[data-s="${b.dataset.s}"]`, rowsEl); if (row) bd.scrollTop = Math.max(0, row.offsetTop - 34); }
  });
  // Steps, Log and Data; the log's level filter
  const tabs = seg($('.rdr-tabs', r), v => { tab = v; $$('.rdr-v', r).forEach(x => x.hidden = x.dataset.v !== v); bd.scrollTop = 0; if (v === 'data') paintData(); if (v === 'log' && follow && R.st === 'run') bd.scrollTop = bd.scrollHeight; });
  seg($('.rdr-lvs', r), v => { lvl = v; filterLog(true); });
  c.on(followB, 'click', () => { follow = !follow; followB.setAttribute('aria-pressed', String(follow)); followB.dataset.tip = follow ? 'Follow the run' : 'Stay put'; say(follow ? 'Following the run' : 'Staying put'); });
  // the drawer folds down to its head, and drags taller from its top edge (or the arrow keys on it)
  const maxH = () => Math.max(160, frame.clientHeight - 64);
  const setH = h => { h = Math.round(Math.max(120, Math.min(maxH(), h))); dw.style.setProperty('--rdr-h', h + 'px'); grip.setAttribute('aria-valuenow', h); grip.setAttribute('aria-valuemax', maxH()); };
  const fold = open => { dw.classList.add('anim'); dw.classList.toggle('shut', !open); tg.setAttribute('aria-expanded', String(open)); c.later(REDUCE ? 0 : 500, () => dw.classList.remove('anim')); };
  c.on(tg, 'click', () => fold(dw.classList.contains('shut')));
  let g = null;
  c.on(grip, 'pointerdown', e => { g = { y:e.clientY, h:dw.classList.contains('shut') ? 45 : dw.getBoundingClientRect().height }; grip.setPointerCapture(e.pointerId); grip.classList.add('on'); dw.classList.add('drag'); if (dw.classList.contains('shut')){ dw.classList.remove('shut'); tg.setAttribute('aria-expanded', 'true'); } });
  c.on(grip, 'pointermove', e => { if (g) setH(g.h - (e.clientY - g.y)); });
  const up = () => { g = null; grip.classList.remove('on'); dw.classList.remove('drag'); }; c.on(grip, 'pointerup', up); c.on(grip, 'pointercancel', up);
  c.on(grip, 'keydown', e => { const cur = dw.getBoundingClientRect().height, d = { ArrowUp:24, ArrowDown:-24 }[e.key]; let h = null;
    if (d) h = cur + d; if (e.key === 'Home') h = 120; if (e.key === 'End') h = maxH(); if (h == null) return; e.preventDefault(); if (dw.classList.contains('shut')) fold(true); setH(h); });
  setH(312);
  start();
  // the preview's story: approve the step the run waits on, then read the log, its errors, and what the research handed on
  c.story(async s => {
    await s.until(() => R.st === 'wait'); await s.beat(2.4);
    await s.tap($('.rdr-ask [data-a="yes"]', r));
    await s.until(() => R.st === 'ok'); await s.beat(1.6);
    await s.tap($('.rdr-tabs [data-v="log"]', r)); await s.beat(2.4);
    await s.tap($('.rdr-lvs [data-v="error"]', r)); await s.beat(2.4);
    await s.tap($('.rdr-tabs [data-v="data"]', r)); await s.beat(1.4);
    await s.tap($('.rdr-ds [data-s="research"]', r)); await s.beat(3);
  });
});
/* ---------- Memory panel ---------- */
DM.def('memory-panel', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{book}', I('book')).replace('{spark}', I('spark','xs'));
  // where a memory came from: an app's own mark, or an icon for something said in chat or an edit
  const ICON = { chat:'comment', edit:'edit' };
  const mark = s => BRAND[s] || I(ICON[s] || s, 'xs');
  const KIND = { brand:['Brand', 'var(--pl)'], process:['Process', 'var(--pt)'] };
  let M = [
    ['brand','Primary buttons use the accent blue, never black','figma','Pricing review in Figma, Sep 12'],
    ['brand','Headlines stay under eight words','chat','You told the agent, Aug 30'],
    ['process','Ask Maya before publishing to the shared library','slack','A thread in #design-system, Sep 4'],
    ['brand','Card radius is 16px on web, 12px in the app','github','tokens.css on GitHub, Sep 18'],
    ['process','Run the launch checklist before every PR','notion','Launch checklist in Notion, Sep 20'],
    ['process','File design bugs in the Design QA project','linear','DES-214 in Linear, Sep 26'],
    ['brand','No em dashes in product copy','drive','Voice and tone guide in Drive, Oct 2']
  ].map((m, i) => ({ id:i, k:m[0], t:m[1], from:m[2], s:m[3] }));
  const list = $('.mmx-list', r), st = $('.mmx-st', r), srcs = $('.mmx-srcs', r), fi = $('.mmx-fi', r), ft = $('.mmx-ft', r);
  let f = 'all', nid = 100;
  // the count, and the apps the memories came from
  const count = () => { swap(st, M.length + (M.length === 1 ? ' memory' : ' memories')); srcs.innerHTML = [...new Set(M.map(m => m.from).filter(s => BRAND[s]))].map(s => `<span>${BRAND[s]}</span>`).join(''); };
  const meta = m => `<span class="k">${KIND[m.k][0]}</span><span aria-hidden="true">·</span><span class="s">${m.s}</span>${m.isNew ? '<span class="tag nw">New</span>' : ''}${m.used ? '<span class="tag nw">Used</span>' : ''}`;
  const rowOf = m => $(`.mmx-m[data-id="${m.id}"]`, list);
  function item(m){
    const el = html(`<div class="mmx-m${m.isNew ? ' new' : ''}${m.learn ? ' learn' : ''}" data-id="${m.id}" style="--k:${KIND[m.k][1]}"><span class="mmx-src" aria-hidden="true">${m.learn ? '<span class="spin"></span>' : mark(m.from)}</span><span class="mmx-b"><span class="t${m.learn ? ' shim' : ''}" spellcheck="false">${m.t}</span><span class="mmx-meta">${meta(m)}</span></span><span class="acts"><button class="ib ed" aria-label="Edit" data-tip="Edit">${I('edit','xs')}</button><button class="ib rm" aria-label="Forget" data-tip="Forget">${I('trash','xs')}</button></span></div>`);
    const t = $('.t', el);
    $('.ed', el).onclick = () => { t.contentEditable = 'true'; t.focus({ preventScroll:true }); const s = document.getSelection(); s.selectAllChildren(t); s.collapseToEnd();
      const done = () => { t.contentEditable = 'false'; m.t = t.textContent.trim() || m.t; m.s = 'Edited by you, just now'; m.from = 'edit'; t.textContent = m.t; update(m); count(); };
      t.onkeydown = e => { if (e.key === 'Enter'){ e.preventDefault(); t.blur(); } }; t.onblur = done; };
    $('.rm', el).onclick = () => { const i = M.indexOf(m); M.splice(i, 1); count();
      const g = html(`<div class="mmx-gone"><span>Forgot “${m.t.slice(0, 32)}${m.t.length > 32 ? '…' : ''}”</span><button>Undo</button></div>`); el.replaceWith(g); enter(g);
      const tm = setTimeout(() => { g.classList.add('leave'); setTimeout(() => g.remove(), 320); }, 4000);
      $('button', g).onclick = () => { clearTimeout(tm); M.splice(i, 0, m); count(); const n = item(m); g.replaceWith(n); enter(n); }; };
    return el;
  }
  // a memory's row catches up with its data: its source, its text once it has been learned, its tags and its highlight
  function update(m, pulse){
    const el = rowOf(m); if (!el) return;
    const src = $('.mmx-src', el), t = $('.t', el);
    if (!m.learn && el.classList.contains('learn')){ el.classList.remove('learn'); t.classList.remove('shim'); swap(t, m.t); src.innerHTML = mark(m.from); enter(src.firstElementChild); }
    else if (t.contentEditable !== 'true') src.innerHTML = mark(m.from);
    el.classList.toggle('new', !!m.isNew);
    $('.mmx-meta', el).innerHTML = meta(m);
    if (pulse){ el.classList.remove('use'); void el.offsetWidth; el.classList.add('use'); }
  }
  function paint(){ list.innerHTML = ''; M.filter(m => f === 'all' || m.k === f).forEach(m => list.appendChild(item(m))); stagger([...list.children], 40); }
  // a row that arrives opens its own height, so the panel grows smoothly instead of jumping
  const grow = el => { if (REDUCE) return; const cs = getComputedStyle(el), gap = parseFloat(getComputedStyle(list).rowGap) || 0, ease = getComputedStyle(r).getPropertyValue('--ease').trim() || 'ease';
    el.animate([{ height:'0px', paddingTop:'0px', paddingBottom:'0px', marginBottom:-gap + 'px', opacity:0, filter:'blur(4px)', overflow:'hidden' }, { height:cs.height, paddingTop:cs.paddingTop, paddingBottom:cs.paddingBottom, marginBottom:'0px', opacity:1, filter:'blur(0px)', overflow:'hidden' }], { duration:560, easing:ease }); };
  seg($('.mmx-tab', r), v => { f = v; paint(); });
  count(); paint();
  // the preview: the agent learns a rule from your edit in Figma, then drafts an email in Gmail with three memories, which
  // pulse as it reads them. Every state lives in the memories' data, so switching tabs keeps it; taking over settles it
  c.run(async () => {
    await c.step(2200);
    const m = { id:nid++, k:'brand', t:'Learning from your edit in Pricing v4', from:'figma', s:'Just now', learn:true };
    const learnt = () => Object.assign(m, { learn:false, t:'Use “Start free” instead of “Sign up” on CTAs', s:'Your edit in Pricing v4, just now' });
    c.taken(() => { if (m.learn){ learnt(); update(m); } if (ft.classList.contains('shim')){ ft.classList.remove('shim'); fi.innerHTML = I('spark','xs'); swap(ft, 'Used in 14 answers this week'); } });
    M.unshift(m); count(); if (f === 'brand' || f === 'all'){ const el = item(m); list.prepend(el); grow(el); }
    await c.step(1500);
    learnt(); m.isNew = true; update(m);
    await c.step(2600);
    m.isNew = false; m.s = 'Your edit in Figma, today'; update(m);
    await c.step(1000);
    fi.innerHTML = BRAND.gmail; enter(fi.firstElementChild);
    ft.classList.add('shim'); swap(ft, 'Drafting the launch email in Gmail');
    await c.step(1100);
    let n = 0;
    for (const id of [m.id, 1, 6]){ const x = M.find(y => y.id === id); if (!x) continue; x.used = true; n++; update(x, true); await c.step(700); }
    ft.classList.remove('shim'); swap(ft, `Used ${n} ${n === 1 ? 'memory' : 'memories'} in the launch email draft`);
  });
});
/* ---------- Model compare ---------- */
DM.def('model-compare', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{plus}', I('plus','xs'));
  // the models on offer: the letter and colour of each one's mark (with the text colour on it), what it is good at, and how
  // it behaves in the preview: time to finish, tokens a second, cost, and its answer to the first prompt
  const MOD = {
    Opus:{ k:'O', c:'var(--pl)', t:'var(--on-ink)', d:'Most capable, slower', ms:2400, tps:38, cost:.021, o:'Pro gives every designer an agent that knows your tokens, so reviews take minutes, not days.' },
    Sonnet:{ k:'S', c:'var(--accent)', t:'var(--on-accent)', d:'Balanced speed and quality', ms:1300, tps:74, cost:.006, o:'Ship polished pages faster with an agent that checks every frame for you.' },
    Haiku:{ k:'H', c:'var(--pm)', t:'var(--on-ink)', d:'Fastest, lowest cost', ms:600, tps:142, cost:.001, o:'Your design QA, on autopilot.' }
  };
  const generic = { Opus:'A considered take: the trade-offs first, then one clear recommendation you can act on.', Sonnet:'A clear, direct answer with the two points that matter most.', Haiku:'Short answer: yes, and the one line why.' };
  const form = $('.mcx-in', r), cols = $('.mcx-cols', r), q = $('.mcx-q', r), go = $('.mcx-go', r), cnt = $('.mcx-n', r), add = $('.mcx-add', r), pa = $('.mcx-pa', r), live = $('.mcx-live', r);
  const DEF = q.value, MIN = 2, MAX = 3, C = [];
  let uid = 0, asked = '', sending = false, busy = 0;
  const mark = n => `<span class="mcx-mk" style="background:${MOD[n].c};color:${MOD[n].t}" aria-hidden="true">${MOD[n].k}</span>`;
  const item = n => `${mark(n)}<span>${n}<span class="d">${MOD[n].d}</span></span>`;
  // a rough count of the tokens in some words, for the live count and the totals
  const tok = words => Math.round(words * 1.35);
  const tokens = n => n + (n === 1 ? ' token' : ' tokens');
  function sync(){
    cnt.textContent = C.length + (C.length > 1 ? ' models' : ' model');
    C.forEach(col => { $('.mcx-x', col.el).hidden = C.length <= MIN; });
    add.hidden = C.length >= MAX;
    pa.innerHTML = Object.keys(MOD).map(n => `<button class="mi" role="menuitem" data-close data-m="${n}">${item(n)}</button>`).join('');
    $$('.mi', pa).forEach(b => b.onclick = () => addCol(b.dataset.m, true));
    go.disabled = sending || !q.value.trim();
  }
  function head(col){
    const el = col.el;
    $('.mcx-sel', el).innerHTML = `${mark(col.m)}<span class="nm">${col.m}</span>${I('chev-d','xs')}`;
    $('.mcx-sel', el).setAttribute('aria-label', col.m + ', swap model');
    $('.mcx-x', el).setAttribute('aria-label', 'Remove ' + col.m);
    el.setAttribute('aria-label', col.m);
    $$('.pop .mi', el).forEach(x => x.setAttribute('aria-checked', x.dataset.m === col.m));
  }
  // a column before its first answer: what the model is good at, and a quiet line where the answer will go
  function idle(col){ col.res = null; col.el.classList.remove('done'); $('.mcx-m', col.el).textContent = MOD[col.m].d; $('.mcx-a', col.el).innerHTML = '<span class="ph">Waiting for a prompt</span>'; }
  function addCol(m, fresh){
    const id = 'mcx-p' + (uid++);
    const el = html(`<section class="mcx-c"><div class="mcx-h"><button class="mcx-sel" data-pop=".${id}" aria-haspopup="menu" aria-expanded="false"></button><button class="ib mcx-x" data-tip="Remove">${I('x','xs')}</button></div><div class="pop mcx-pop ${id}" role="menu" aria-label="Swap model">${Object.keys(MOD).map(n => `<button class="mi" role="menuitemradio" data-close data-m="${n}">${item(n)}<span class="ck">${I('check','xs')}</span></button>`).join('')}</div><div class="mcx-m num"></div><div class="mcx-a"></div><div class="mcx-ft"><button class="pill line sm mcx-pick" aria-pressed="false">Use this answer</button></div></section>`);
    const col = { m, el, run:0, res:null };
    C.push(col); cols.appendChild(el); head(col); idle(col);
    // swapping the model clears the pick and, once a prompt has been sent, runs it on the new model in this column
    $$('.pop .mi', el).forEach(x => x.addEventListener('click', () => { if (col.m === x.dataset.m) return; col.m = x.dataset.m; col.run++; head(col); pick(null); if (asked) c.run(() => one(col)); else idle(col); }));
    $('.mcx-x', el).onclick = () => {
      hideTip(); const had = el.contains(document.activeElement);
      C.splice(C.indexOf(col), 1); col.run++; if (el.classList.contains('win')) pick(null);
      sync(); el.classList.add('leave');
      setTimeout(() => { el.remove(); if (had) (add.hidden ? q : add).focus({ preventScroll:true }); }, 260);
    };
    $('.mcx-pick', el).onclick = () => pick(el.classList.contains('win') ? null : col);
    if (fresh){ enter(el); sync(); if (asked) c.run(() => one(col)); }
    return col;
  }
  // the answer that was kept: its column takes the accent's tint, and pressing it again lets it go
  function pick(col){
    C.forEach(x => { const on = x === col, b = $('.mcx-pick', x.el); x.el.classList.toggle('win', on); b.setAttribute('aria-pressed', on); b.innerHTML = on ? I('check','xs') + 'Chosen' : 'Use this answer'; });
    if (col) live.textContent = 'Using the answer from ' + col.m;
  }
  async function one(col){
    const id = ++col.run, el = col.el, m = MOD[col.m], a = $('.mcx-a', el), meta = $('.mcx-m', el);
    el.classList.remove('done'); col.res = null; meta.textContent = m.d; busy++;
    a.innerHTML = '<span class="wk"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Thinking</span></span>';
    try {
      await c.wait(m.ms * .35); if (id !== col.run) return;
      const text = asked === DEF ? m.o : generic[col.m], ws = text.split(' ');
      a.innerHTML = '<span></span>'; const p = a.firstChild;
      for (let i = 0; i < ws.length; i++){
        p.insertAdjacentHTML('beforeend', `<span class="w">${ws[i]} </span>`); meta.textContent = tokens(tok(i + 1));
        await c.wait(m.ms * .65 / ws.length); if (id !== col.run) return;
      }
      col.res = { s:m.ms / 1000, n:tok(ws.length), cost:m.cost };
      meta.innerHTML = `<span class="mcx-tm"></span> · <span class="mcx-tk"></span> · <span class="mcx-co"></span>`;
      $('.mcx-tm', meta).textContent = col.res.s.toFixed(1) + 's'; $('.mcx-tk', meta).textContent = tokens(col.res.n); $('.mcx-co', meta).textContent = '$' + m.cost.toFixed(3);
      $('.mcx-tk', meta).dataset.tip = 'Tokens in the answer';
      el.classList.add('done'); tips(col, false, false);
    } finally { busy--; if (!busy) best(); }
  }
  function tips(col, fast, cheap){
    const meta = $('.mcx-m', col.el), tm = $('.mcx-tm', meta), co = $('.mcx-co', meta); if (!tm) return;
    tm.classList.toggle('best', fast); tm.dataset.tip = (fast ? 'Fastest. ' : '') + 'Time to finish, ' + MOD[col.m].tps + ' tokens a second';
    co.classList.toggle('best', cheap); co.dataset.tip = cheap ? 'Cheapest answer' : 'Cost of this answer';
  }
  // once every column has answered, the fastest time and the lowest cost read a step darker
  function best(){
    const done = C.filter(x => x.res); if (done.length < 2) return;
    const fast = done.reduce((a, b) => b.res.s < a.res.s ? b : a), cheap = done.reduce((a, b) => b.res.cost < a.res.cost ? b : a);
    done.forEach(x => tips(x, x === fast, x === cheap));
  }
  ['Opus','Sonnet','Haiku'].forEach(m => addCol(m)); sync();
  // Run stays off while a run is answering, even if the prompt changes
  const run = () => c.run(async () => {
    const v = q.value.trim(); if (!v || sending) return;
    asked = v; sending = true; pick(null); go.disabled = true; live.textContent = 'Running on ' + C.length + ' models';
    try { await Promise.all(C.map(one)); } finally { sending = false; go.disabled = !q.value.trim(); }
    live.textContent = 'All ' + C.length + ' answers are in';
  });
  form.onsubmit = e => { e.preventDefault(); run(); };
  q.oninput = () => { go.disabled = sending || !q.value.trim(); };
  // the preview's story: run the prompt on all three, read the answers, then keep Sonnet's
  c.story(async s => {
    await s.beat(2);
    await s.tap(go); s.away();
    await s.until(() => !sending && C.every(x => x.res)); await s.beat(3);
    const son = C.find(x => x.m === 'Sonnet');
    if (son){ await s.tap($('.mcx-pick', son.el)); s.away(); }
    await s.beat(4);
  });
});
/* ---------- Tools and connections ---------- */
DM.def('tool-connections', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{refresh}', I('refresh','xs')).replace('{plus}', I('plus','xs'));
  let T = [
    ['@figma','Figma','Read and edit frames','var(--pl)',1],
    ['@github','GitHub','designme/web, PRs only','var(--fg)',0],
    ['@slack','Slack','#design, #launch','var(--pm)',1],
    ['db','Analytics','Read only, last 90 days','var(--pt)',1],
    ['globe','Web search','Any public site','var(--pb)',2]
  ];
  const ADD = [['table','Google Sheets','var(--ok)'],['bell','Linear','var(--pp)'],['mail','Gmail','var(--pr)']];
  const list = $('.hnx-list', r), st = $('.hnx-st', r), pop = $('.hnx-pop', r);
  const PM = ['Off','Ask','Allow'];
  function row(t){
    const el = html(`<div class="hnx-t${t[4] === 0 ? ' off' : ''}">${t[0][0] === '@' ? `<span class="ic brandic">${BRAND[t[0].slice(1)]}</span>` : `<span class="ic" style="color:${t[3]};background:color-mix(in srgb,${t[3]} 12%,transparent)">${I(t[0],'xs')}</span>`}<span class="t">${t[1]}<span>${t[2]}</span></span><div class="hnx-pm" role="group" aria-label="${t[1]} permission"><span class="kn"></span>${PM.map((p, i) => `<button aria-pressed="${i === t[4]}" data-tip="${['Agent cannot use it','Agent asks first','Agent uses it freely'][i]}">${p}</button>`).join('')}</div></div>`);
    const g = $('.hnx-pm', el), kn = $('.kn', g), bs = $$('button', g);
    // the knob slides when a choice changes; when the row first appears it is simply in place
    const place = now => { const b = bs[t[4]]; if (now) kn.style.transition = 'none'; kn.style.left = b.offsetLeft + 'px'; kn.style.width = b.offsetWidth + 'px'; if (now){ void kn.offsetWidth; kn.style.transition = ''; } };
    bs.forEach((b, i) => b.onclick = () => { t[4] = i; bs.forEach((x, j) => x.setAttribute('aria-pressed', j === i)); place(); el.classList.toggle('off', i === 0); count(); });
    // a click with the mouse doesn't take focus, so it never leaves a focus ring; the keyboard still reaches every option
    bs.forEach(b => b.onmousedown = e => e.preventDefault());
    requestAnimationFrame(() => place(true)); new ResizeObserver(() => place(true)).observe(g);
    el._t = t; return el;
  }
  // the first count is written straight in, so the header doesn't crossfade from the template's number on load
  const count = now => { const n = T.filter(t => t[4] > 0).length + ' connected'; if (now) st.textContent = n; else swap(st, n); };
  T.forEach(t => list.appendChild(row(t))); stagger([...list.children], 50); count(true);
  function menu(){ pop.innerHTML = ADD.length ? ADD.map((a, i) => `<button class="mi" role="menuitem" data-close data-i="${i}">${I(a[0],'xs')}<span>${a[1]}</span></button>`).join('') : '<div class="ph" style="padding:8px;font-size:12.5px;color:var(--muted)">All tools connected</div>';
    $$('.mi', pop).forEach(m => m.addEventListener('click', () => { const a = ADD.splice(+m.dataset.i, 1)[0]; const t = [a[0], a[1], 'Just connected', a[2], 1]; T.push(t); const el = row(t); list.appendChild(el); enter(el); count(); menu(); })); }
  menu();
  // Test all: every connected tool shows a small spinner at once, and they settle one by one; only a failure changes its line
  const test = $('.hnx-test', r), testWas = test.innerHTML;
  test.onclick = () => c.run(async () => {
    const rows = [...list.children].filter(el => el._t[4] > 0);
    test.disabled = true; test.innerHTML = '<span class="spin"></span>Testing'; swap(st, 'Testing ' + rows.length + ' connections');
    rows.forEach(el => el.classList.add('chk'));
    for (const el of rows){ await c.wait(600); el.classList.remove('chk');
      if (el._t[1] === 'Slack' && !el._t.ok){ el.classList.add('err'); swap($('.t span', el), 'Token expired. Reconnect to use it'); }
    }
    test.disabled = false; test.innerHTML = testWas;
    swap(st, rows.filter(el => !el.classList.contains('err')).length + ' of ' + rows.length + ' healthy');
    const bad = [...list.children].find(el => el.classList.contains('err'));
    // a second test finds the row already offering Reconnect, so it keeps that button
    const pm = bad && $('.hnx-pm', bad);
    if (pm){ const b = html(`<button class="pill accent sm">Reconnect</button>`); pm.replaceWith(b); enter(b);
      b.onclick = () => c.run(async () => { b.innerHTML = '<span class="spin"></span>'; await c.wait(900); bad.classList.remove('err'); bad._t.ok = true; const n = row(bad._t); bad.replaceWith(n); swap(st, [...list.children].filter(el => el._t[4] > 0).length + ' of ' + [...list.children].filter(el => el._t[4] > 0).length + ' healthy'); }); }
  });
  // the preview's story: test everything, Slack's token has expired, reconnect it, and every connection is healthy
  c.story(async s => {
    await s.beat(3);
    await s.tap(test); s.away();
    await s.until(() => $('.hnx-t.err .pill', list)); await s.beat(3);
    await s.tap($('.hnx-t.err .pill', list)); s.away();
    await s.until(() => !$('.hnx-t.err', list)); await s.beat(1);
  });
});
/* ---------- Knowledge sources ---------- */
DM.def('knowledge-sources', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{plus}', I('plus','xs')).replace('{refresh}', I('refresh','xs')).replace('{trash}', I('trash','xs'));
  // a source's type gives it its icon: uploaded files, a website the agent crawls, or a connected folder of docs
  const KIND = { files:['file-text','var(--pp)'], web:['globe','var(--pb)'], folder:['folder','var(--pm)'] };
  // a connected folder and a set of uploads are ready, and a PDF is being read. One source indexes at a time and the rest
  // wait in line; a source's chunks count once it has been indexed. `ms` is how long a full pass takes in this preview
  const S = [
    { kind:'folder', name:'Product docs', n:86, unit:'pages', chunks:642, st:'ready', ago:'2m ago', had:true, ms:2500 },
    { kind:'files', name:'Sales playbooks', n:18, unit:'files', chunks:318, st:'ready', ago:'1h ago', had:true, ms:2500 },
    { kind:'files', name:'Brand book 2024.pdf', n:24, unit:'pages', chunks:48, st:'queued', ms:19000, fail:{ at:9, why:'Scanned PDF, no text found', fix:'Retry with OCR' } }
  ];
  const FOLDERS = [['Design specs', 'Google Drive', 57, 230], ['Research notes', 'Notion', 31, 124]];
  const list = $('.ksx-list', r), st = $('.ksx-st', r), add = $('.ksx-add', r), pop = $('.ksx-pop', r), mpop = $('.ksx-mpop', r), file = $('.ksx-file', r);
  const fmt = n => n.toLocaleString('en-US');
  const of = (n, unit) => fmt(n) + ' ' + (n === 1 ? unit.slice(0, -1) : unit);
  const line = x => x.st === 'queued' ? (x.ocr ? 'Queued to read with OCR' : 'Queued') : x.st === 'failed' ? x.fail.why : of(x.n, x.unit) + ' · Synced ' + x.ago;
  function row(x){
    const [ic, col] = KIND[x.kind];
    x.el = html(`<div class="ksx-s" role="listitem"><span class="ic" style="color:${col};background:color-mix(in srgb,${col} 12%,transparent)" aria-hidden="true">${I(ic,'xs')}</span><span class="t"><span class="nm"></span><span class="d"></span></span><button class="ib ksx-more" aria-haspopup="menu" aria-expanded="false" data-tip="More" data-pop=".ksx-mpop" data-pop-align="end">${I('more')}</button><div class="ksx-fx fold shut" inert><div><div><button class="pill accent sm ksx-fix"></button><button class="pill ghost sm ksx-del">Remove</button></div></div></div></div>`);
    $('.nm', x.el).textContent = x.name; $('.ksx-more', x.el).setAttribute('aria-label', 'Actions for ' + x.name);
    $('.ksx-fix', x.el).onclick = () => { x.ocr = true; x.st = 'queued'; x.ms = 3000; paint(x); next(); };
    $('.ksx-del', x.el).onclick = () => remove(x);
    paint(x, true); return x.el;
  }
  // the progress bar and its count, while a source is being indexed
  function prog(x){
    const bar = $('.ksx-bar', x.el); if (!bar) return; const k = Math.floor(x.done);
    $('i', bar).style.width = k / x.n * 100 + '%'; bar.setAttribute('aria-valuenow', k);
    $('.num', x.el).textContent = fmt(k) + ' of ' + of(x.n, x.unit);
  }
  function paint(x, now){
    const d = $('.d', x.el); x.el.dataset.st = x.st;
    // the bar goes through the same swap as the line before it, so a line still swapping in can't land on top of it
    if (x.st === 'indexing'){ const bar = `<span class="ksx-bar" role="progressbar" aria-label="Indexing ${x.name.replace(/[<&"]/g, '')}" aria-valuemin="0" aria-valuemax="${x.n}"><i style="width:0"></i></span><span class="num"></span>`; if (now){ d.innerHTML = bar; prog(x); } else swap(d, bar, true); }
    else { const t = document.createElement('span'); t.textContent = line(x); if (now) d.replaceChildren(t); else swap(d, t.outerHTML, true); }
    const fx = $('.ksx-fx', x.el), on = x.st === 'failed';
    if (on) $('.ksx-fix', x.el).textContent = x.fail.fix;
    fx.classList.toggle('shut', !on); fx.inert = !on;
  }
  const total = () => `${S.length} source${S.length === 1 ? '' : 's'} · ${fmt(S.reduce((a, x) => a + (x.had ? x.chunks : 0), 0))} chunks`;
  const counts = now => { if (now) st.textContent = total(); else swap(st, total()); };
  // the one being indexed moves on every tick; a scanned PDF stops where its text runs out, until it is read with OCR
  function next(){
    if (S.some(x => x.st === 'indexing')) return;
    const x = S.find(y => y.st === 'queued'); if (!x) return;
    x.st = 'indexing'; x.done = 0; paint(x);
  }
  c.every(100, () => {
    const x = S.find(y => y.st === 'indexing'); if (!x) return;
    x.done = Math.min(x.n, x.done + x.n * 100 / x.ms);
    if (x.fail && !x.ocr && x.done >= x.fail.at){ x.st = 'failed'; paint(x); counts(); return next(); }
    prog(x);
    if (x.done >= x.n){ x.st = 'ready'; x.ago = 'just now'; x.had = true; paint(x); counts(); next(); }
  });
  function addSource(x){ x.st = 'queued'; S.push(x); list.appendChild(row(x)); enter(x.el); counts(); next(); }
  function remove(x){
    const i = S.indexOf(x); if (i < 0) return; S.splice(i, 1); counts(); next();
    x.el.classList.add('leave'); c.later(REDUCE ? 0 : 340, () => x.el.remove());
  }
  S.forEach(x => list.appendChild(row(x))); stagger([...list.children], 50); counts(true); next();
  // Re-sync and Remove act on the row whose button opened the menu; a source still waiting or indexing can't be re-synced yet
  let cur = null;
  c.on(list, 'click', e => { const b = e.target.closest('.ksx-more'); if (!b) return; cur = S.find(x => x.el.contains(b)); $('.ksx-rs', mpop).disabled = !cur || cur.st === 'queued' || cur.st === 'indexing'; });
  $('.ksx-rs', mpop).onclick = () => { if (!cur || !S.includes(cur)) return; cur.st = 'queued'; cur.ms = cur.ocr ? 3000 : cur.fail ? 19000 : 2500; paint(cur); next(); };
  $('.ksx-rm', mpop).onclick = () => cur && remove(cur);
  // Add source: upload files (the file picker), add a website (its address), or connect a folder (from the ones offered)
  function view(v){
    if (v === 'web') pop.innerHTML = `<form class="ksx-web"><div class="ph">Add a website</div><div class="ksx-in">${I('globe','xs')}<input placeholder="example.com/docs" aria-label="Website address" spellcheck="false" autocomplete="off"><button class="pill accent sm" type="submit">Add</button></div></form>`;
    else if (v === 'folder') pop.innerHTML = '<div class="ph">Connect a folder</div>' + (FOLDERS.length ? FOLDERS.map((f, i) => `<button class="mi" role="menuitem" data-close data-i="${i}">${I('folder','xs')}<span>${f[0]}<span class="d">${f[1]}</span></span></button>`).join('') : '<div class="ph">All folders connected</div>');
    else pop.innerHTML = [['upload', 'Upload files', 'files'], ['globe', 'Add a website', 'web'], ['folder', 'Connect a folder', 'folder']].map(([ic, t, k]) => `<button class="mi" role="menuitem" data-v="${k}"${k === 'files' ? ' data-close' : ''}>${I(ic,'xs')}<span>${t}</span></button>`).join('');
  }
  view('main');
  c.on(add, 'click', () => { if (!pop.classList.contains('open')) view('main'); });
  // a step inside the menu swaps its content after the click has been handled, so the click still counts as inside it
  c.on(pop, 'click', e => {
    const m = e.target.closest('.mi'); if (!m) return;
    if (m.dataset.v === 'files') return file.click();
    if (m.dataset.v){ const v = m.dataset.v, mine = e.isTrusted; c.later(0, () => { view(v); placePop(add, pop); if (mine && v === 'web') $('input', pop).focus({ preventScroll:true }); }); return; }
    if (m.dataset.i){ const f = FOLDERS.splice(+m.dataset.i, 1)[0]; addSource({ kind:'folder', name:f[0], n:f[2], unit:'pages', chunks:f[3], ms:3000 }); }
  });
  c.on(pop, 'submit', e => {
    e.preventDefault(); const inp = $('input', pop), v = inp.value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!v) return inp.focus();
    closePops(); addSource({ kind:'web', name:v, n:142, unit:'pages', chunks:196, ms:4500 });
  });
  file.onchange = () => { const fs = [...file.files]; if (!fs.length) return;
    addSource({ kind:'files', name:fs.length === 1 ? fs[0].name : fs.length + ' files', n:fs.length, unit:'files', chunks:fs.length * 12, ms:1500 }); file.value = ''; };
  // the preview's story: add the docs site, which waits its turn; the PDF turns out to be a scan, so read it with OCR, and
  // everything ends up indexed
  c.story(async s => {
    const pdf = S[2];
    await s.beat(3);
    await s.tap(add); await s.beat(2);
    await s.tap($('.mi[data-v="web"]', pop)); await s.beat(1);
    const inp = $('input', pop);
    await s.type(inp, 'designme.dev/docs', { n:.1, keep:true });
    await s.beat(1);
    await s.tap($('button[type="submit"]', pop)); s.away();
    await s.until(() => pdf.st === 'failed'); await s.beat(2);
    await s.tap($('.ksx-fix', pdf.el)); s.away();
    await s.until(() => S.every(x => x.st === 'ready')); await s.beat(1);
  });
});
/* ---------- Scheduled runs ---------- */
DM.def('scheduled-runs', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{plus}', I('plus','xs'));
  // in this preview it is Saturday afternoon, so Monday at 9:00 is two days off, and every new schedule runs at 9:00
  const R = [
    { mark:'palette', col:'var(--pl)', name:'Weekly design QA', when:'Mondays at 9:00', next:'Next in 2 days', on:true, res:'ok', ago:'5 days ago' },
    { mark:'@figma', name:'Sync tokens from Figma', when:'Every day at 8:00', next:'Next in 17h', on:true, res:'bad', why:'Figma token expired', fix:'Reconnect Figma' },
    { mark:'chart', col:'var(--pt)', name:'Competitor price check', when:'Fridays at 17:00', next:'Next in 6 days', on:true, res:'ok', ago:'yesterday' }
  ];
  const list = $('.shx-list', r), st = $('.shx-st', r), add = $('.shx-add', r), pop = $('.shx-pop', r), form = $('.shx-f', r);
  const inp = $('.shx-in', r), days = $('.shx-days', r), sum = $('.shx-sum', r), mk = $('.shx-mk', r);
  function row(x){
    const ic = x.mark[0] === '@' ? `<span class="ic brandic" aria-hidden="true">${BRAND[x.mark.slice(1)]}</span>` : `<span class="ic" style="color:${x.col};background:color-mix(in srgb,${x.col} 12%,transparent)" aria-hidden="true">${I(x.mark,'xs')}</span>`;
    x.el = html(`<div class="shx-r" role="listitem">${ic}<span class="t"><span class="nm"></span><span class="d"></span><span class="res"></span></span><span class="shx-act"><button class="ib shx-run" data-tip="Run now">${I('play')}</button><button class="toggle" role="switch"></button></span><div class="shx-fx fold shut" inert><div><div><button class="pill accent sm shx-fix"></button></div></div></div></div>`);
    $('.nm', x.el).textContent = x.name; $('.shx-run', x.el).setAttribute('aria-label', 'Run ' + x.name + ' now'); $('.toggle', x.el).setAttribute('aria-label', x.name);
    $('.shx-run', x.el).onclick = () => run(x);
    $('.toggle', x.el).onclick = () => { x.on = !x.on; paint(x); counts(); };
    $('.shx-fix', x.el).onclick = () => fix(x);
    paint(x, true); return x.el;
  }
  function paint(x, now){
    const el = x.el, put = (e, t, h) => now ? (h ? e.innerHTML = t : e.textContent = t) : swap(e, t, h);
    el.classList.toggle('off', !x.on); el.dataset.st = x.run ? 'run' : x.res || 'none';
    const tg = $('.toggle', el); tg.setAttribute('aria-checked', x.on); tg.dataset.tip = x.on ? 'Pause' : 'Resume';
    put($('.d', el), x.when + ' · ' + (x.on ? x.next : 'Paused'));
    const res = document.createElement('span'); res.textContent = x.run ? 'Running now' : x.res === 'ok' ? 'Passed ' + x.ago : x.res === 'bad' ? 'Failed: ' + x.why : 'No runs yet';
    put($('.res', el), (!x.run && x.res ? I(x.res === 'ok' ? 'ok' : 'alert', 'xs') : '') + res.outerHTML, true);
    $('.shx-run', el).disabled = !!x.run || !x.on;
    const fx = $('.shx-fx', el), on = x.res === 'bad' && !x.run, b = $('.shx-fix', el);
    if (on && !x.fixing) b.textContent = x.fix;
    fx.classList.toggle('shut', !on); fx.inert = !on;
  }
  function counts(now){
    const on = R.filter(x => x.on).length, off = R.length - on, bad = R.filter(x => x.on && x.res === 'bad' && !x.run).length;
    const t = `${on} active` + (bad ? ` · ${bad} failed` : '') + (off ? ` · ${off} paused` : '');
    if (now) st.textContent = t; else swap(st, t);
  }
  // Run now: the dot on its icon turns while it runs, then it passes
  function run(x){
    if (x.run) return; x.run = true; paint(x); counts();
    c.later(3000, () => { x.run = false; x.res = 'ok'; x.ago = 'just now'; paint(x); counts(); });
  }
  // the fix for a failed run reconnects, then runs it again straight away
  function fix(x){
    if (x.fixing) return; x.fixing = true; $('.shx-fix', x.el).innerHTML = '<span class="spin"></span>Reconnecting';
    c.later(900, () => { x.fixing = false; run(x); });
  }
  R.forEach(x => list.appendChild(row(x))); stagger([...list.children], 50); counts(true);
  // New schedule: a task in words and how often. Custom picks the days; the line under it says when the first run is
  const DAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.innerHTML = DAY.map((d, i) => `<button type="button" aria-pressed="${i === 0 || i === 2 || i === 4}" aria-label="${FULL[i]}">${d[0]}</button>`).join('');
  let rep = 'day';
  const picked = () => rep === 'day' ? [0, 1, 2, 3, 4, 5, 6] : rep === 'mon' ? [0] : $$('button', days).map((b, i) => b.getAttribute('aria-pressed') === 'true' ? i : -1).filter(i => i >= 0);
  const when = ds => ds.length === 7 ? 'Every day at 9:00' : ds.join() === '0,1,2,3,4' ? 'Weekdays at 9:00' : ds.length === 1 ? FULL[ds[0]] + 's at 9:00' : ds.map(d => DAY[d]).join(', ') + ' at 9:00';
  // today is Saturday (5) after 9:00, so tomorrow's run is 18 hours off and the rest whole days
  const next = ds => { const n = Math.min(...ds.map(d => (d - 5 + 7) % 7 || 7)); return n === 1 ? 'Next in 18h' : `Next in ${n} days`; };
  function form1(){ const ds = picked(); sum.textContent = ds.length ? next(ds).replace('Next', 'First run') : 'Pick at least one day'; mk.disabled = !inp.value.trim() || !ds.length; }
  seg($('.shx-rep', r), v => { rep = v; days.hidden = v !== 'custom'; form1(); if (pop.classList.contains('open')) placePop(add, pop); });
  $$('button', days).forEach(b => b.onclick = () => { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); form1(); });
  inp.oninput = form1; form1();
  c.on(add, 'click', e => { if (!pop.classList.contains('open') && e.isTrusted) c.later(0, () => inp.focus({ preventScroll:true })); });
  c.on(form, 'submit', e => {
    e.preventDefault(); const ds = picked(); if (!inp.value.trim() || !ds.length) return;
    const x = { mark:'clock', col:'var(--pb)', name:inp.value.trim(), when:when(ds), next:next(ds), on:true, res:null };
    R.push(x); list.appendChild(row(x)); enter(x.el); counts(); closePops(); inp.value = ''; form1();
  });
  // the preview's story: run the design QA now and watch it pass, reconnect Figma so the token sync passes again, then
  // pause the price check
  c.story(async s => {
    const [qa, fig, price] = R;
    await s.beat(3);
    await s.point($('.shx-run', qa.el)); await s.beat(1);
    await s.tap($('.shx-run', qa.el)); s.away();
    await s.until(() => !qa.run && qa.ago === 'just now'); await s.beat(2);
    await s.tap($('.shx-fix', fig.el)); s.away();
    await s.until(() => !fig.run && fig.res === 'ok'); await s.beat(2);
    await s.tap($('.toggle', price.el)); s.away(); await s.beat(3);
  });
});
/* ---------- Agent builder ---------- */
DM.def('agent-builder', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{(spark|alert|play)\}/g, (m, k) => I(k, 'xs'));
  const $r = s => $(s, r);
  const root = $r('.abx'), desc = $r('#abx-desc'), go = $r('.abx-go'), name = $r('.abx-name'), purp = $r('.abx-purp'), ins = $r('.abx-ta'), sel = $r('.abx-sel'), err = $r('.abx-err');
  const tools = $r('.abx-tools'), kn = $r('.abx-kn'), trd = $r('.abx-trd'), st = $r('.abx-st'), test = $r('.abx-test'), save = $r('.abx-save'), pub = $r('.abx-pub'), log = $r('.abx-log'), cs = $r('.abx-cs'), sr = $r('.abx-sr');
  const S = k => $(`.abx-s[data-s="${k}"]`, r);
  // Dotto, the agent's avatar: a dark LED screen in a bezel of the agent's colour, a 5 by 5 grid of dots drawing its eyes and
  // smile. Each one carries only the outline in use; its colour is --m on the builder, so every Dotto in it changes at once
  const SHAPES = { circle:['M4 32A28 28 0 1 0 60 32A28 28 0 1 0 4 32Z', 'M10.5 32A21.5 21.5 0 1 0 53.5 32A21.5 21.5 0 1 0 10.5 32Z'], squircle:['M60 32C60 58.5 58.5 60 32 60S4 58.5 4 32 5.5 4 32 4 60 5.5 60 32Z', 'M53.5 32C53.5 52.3 52.3 53.5 32 53.5S10.5 52.3 10.5 32 11.7 10.5 32 10.5 53.5 11.7 53.5 32Z'] };
  const SHAPE_N = { circle:'Circle', squircle:'Squircle' };
  const COLS = [['accent', 'Accent', 'var(--accent)'], ['blue', 'Blue', '#116ff8'], ['violet', 'Violet', '#7c4dff'], ['orange', 'Orange', '#f76700'], ['green', 'Green', '#00a876']];
  // it starts as an accent squircle (owner, 4 Nov: squircle and circle only)
  const look = { color:'accent', shape:'squircle' };
  let mood = 'idle';
  const dots = (cls, cells) => cells.map(([x, y]) => `<circle${cls ? ` class="${cls}"` : ''} cx="${19 + x * 6.5}" cy="${19 + y * 6.5}" r="${cls ? 2.75 : 1.3}"/>`).join('');
  const GRID = [...Array(25)].map((_, i) => [i % 5, i / 5 | 0]);
  const mascot = () => { const [bz, sc] = SHAPES[look.shape];
    return `<svg class="abx-mascot" viewBox="0 0 64 64" data-shape="${look.shape}" data-state="${mood}" aria-hidden="true" focusable="false"><path class="bz" d="${bz}"/><path class="sc" d="${sc}"/>`
      + `<g class="dg">${dots('', GRID)}</g><g class="lk">${dots('on tp', [[1, 1], [3, 1]])}${dots('on', [[1, 2], [3, 2]])}</g>`
      + `<g class="id">${dots('on', [[0, 3], [4, 3], [1, 4], [2, 4], [3, 4]])}</g><g class="th">${dots('on ld l1', [[1, 4]])}${dots('on ld l2', [[2, 4]])}${dots('on ld l3', [[3, 4]])}</g></svg>`; };
  const av = $r('.abx-av'), sw = $r('.abx-sw'), shp = $r('.abx-shp');
  av.innerHTML = mascot(); av.setAttribute('role', 'img');
  $r('.abx-ch').insertAdjacentHTML('afterbegin', mascot());
  // a change of colour, shape or mood reaches every Dotto in the builder: the avatar, the test chat's header and replies, Live
  function paint(){
    root.style.setProperty('--m', COLS.find(x => x[0] === look.color)[2]);
    const [bz, sc] = SHAPES[look.shape];
    $$('.abx-mascot', r).forEach(m => { m.dataset.shape = look.shape; m.dataset.state = mood; $('.bz', m).setAttribute('d', bz); $('.sc', m).setAttribute('d', sc); });
    av.setAttribute('aria-label', `Avatar: ${COLS.find(x => x[0] === look.color)[1]}, ${SHAPE_N[look.shape].toLowerCase()}`);
  }
  // the pickers are radio groups: a click picks, the arrow keys move and pick (and wrap), Home and End go to the ends, and only
  // the picked one is in the tab order
  function radios(g, on){
    const all = () => $$('[role="radio"]', g), shown = () => all().filter(b => !b.hidden);
    const pick = (v, by) => { const t = all().find(b => b.dataset.v === v); if (!t || t.hidden) v = shown()[0].dataset.v;
      all().forEach(b => { const y = b.dataset.v === v; b.setAttribute('aria-checked', String(y)); b.tabIndex = y ? 0 : -1; }); on(v, by); };
    c.on(g, 'click', e => { const b = e.target.closest('[role="radio"]'); if (b) pick(b.dataset.v, true); });
    c.on(g, 'keydown', e => { const l = shown(), i = l.indexOf(document.activeElement), d = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 }[e.key];
      const to = d ? l[(i + d + l.length) % l.length] : e.key === 'Home' ? l[0] : e.key === 'End' ? l[l.length - 1] : null;
      if (to){ e.preventDefault(); to.focus(); pick(to.dataset.v, true); } });
    return v => pick(v, false);
  }
  sw.innerHTML = COLS.map(([v, n, x]) => `<button role="radio" aria-checked="false" tabindex="-1" aria-label="${n}" data-tip="${n}" data-v="${v}" style="--s:${x}"></button>`).join('');
  // a colour the accent already is shows once, as the accent
  const ink = v => { const t = document.createElement('i'); t.hidden = true; t.style.color = v; root.appendChild(t); const x = getComputedStyle(t).color; t.remove(); return x; };
  const acc = ink('var(--accent)');
  COLS.slice(1).forEach(([v, , x]) => { if (ink(x) === acc) $(`[data-v="${v}"]`, sw).hidden = true; });
  shp.innerHTML = Object.entries(SHAPE_N).map(([v, n]) => `<button role="radio" aria-checked="false" tabindex="-1" aria-label="${n}" data-tip="${n}" data-v="${v}"><svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="${SHAPES[v][0]}"/></svg></button>`).join('');
  // the shape switch slides its knob like the other switches; its first placing is instant
  const knob = document.createElement('span'); knob.className = 'knob'; shp.prepend(knob);
  const place = () => { const b = $('[aria-checked="true"]', shp); if (b){ knob.style.left = b.offsetLeft + 'px'; knob.style.width = b.offsetWidth + 'px'; } };
  const setColor = radios(sw, (v, by) => { look.color = v; paint(); if (by) edited('id'); });
  const setShape = radios(shp, (v, by) => { look.shape = v; place(); paint(); if (by) edited('id'); });
  setColor(look.color); setShape(look.shape);
  requestAnimationFrame(() => { knob.style.transition = 'none'; place(); void knob.offsetWidth; knob.style.transition = ''; });
  new ResizeObserver(place).observe(shp);
  const think = on => { mood = on ? 'thinking' : 'idle'; paint(); };
  // tools, each with what the agent may do there: read, ask first, or act
  const T = [['gmail', 'Gmail'], ['linear', 'Linear'], ['slack', 'Slack']];
  tools.innerHTML = T.map(([k, n]) => `<div class="abx-tl" data-t="${k}">${BRAND[k]}<span class="n">${n}</span><div class="seg2" role="group" aria-label="${n}: what it may do"><button aria-pressed="true" data-v="read">Read</button><button aria-pressed="false" data-v="ask">Ask</button><button aria-pressed="false" data-v="act">Act</button></div></div>`).join('');
  const segs = {}; $$('.abx-tl', tools).forEach(t => segs[t.dataset.t] = seg($('.seg2', t), () => edited('tools')));
  const setSeg = (el, v) => { const b = $(`button[data-v="${v}"]`, el); $$('button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); };
  const TRIG = { chat:'When someone messages it', sched:'Every weekday at 9:00', event:'When an email arrives at support@' };
  seg($r('.abx-trs'), v => { swap(trd, TRIG[v]); edited('trig'); });
  seg($r('.abx-eff'), () => edited('model'));
  kn.innerHTML = '<span class="muted" style="font-size:12px">Nothing yet</span>';
  // what the person has changed since it was drafted: the Drafted tag goes, and the form has unsaved changes
  const tag = k => $('.abx-dt', S(k));
  let state = 'empty';
  const status = (t, cls) => { st.innerHTML = t; st.className = 'abx-st ' + (cls || 'muted'); };
  function edited(k){ const t = tag(k); if (t) t.remove(); if (state !== 'empty'){ state = 'dirty'; status('Unsaved changes'); } valid(); }
  [[name, 'id'], [purp, 'id'], [ins, 'ins'], [sel, 'model']].forEach(([el, k]) => c.on(el, 'input', () => edited(k)));
  c.on(sel, 'change', () => edited('model'));
  // a name is needed to save or publish
  err.id = 'abx-err-' + Math.random().toString(36).slice(2, 8); name.setAttribute('aria-describedby', err.id);
  function valid(){ const ok = !!name.value.trim() || state === 'empty'; err.hidden = ok; name.setAttribute('aria-invalid', String(!ok)); save.disabled = !ok || state === 'empty' || state === 'saved' || state === 'live'; pub.disabled = !ok || state === 'empty' || state === 'live'; return ok; }
  valid(); test.disabled = true;
  // drafting: the agent fills each section in turn from the one sentence, and marks it Drafted
  const D = {
    // it names the agent, then picks its colour and its shape
    id:async () => { name.value = 'Support triage'; purp.value = 'Sorts incoming support emails and routes them to the right team'; await c.wait(350); setColor('violet'); await c.wait(350); setShape('circle'); },
    ins:() => { ins.value = 'Read each new email. Tag it Billing, Bug or How-to, set its priority, and route it to that team. Draft a reply for billing refunds but never send money without asking.'; },
    model:() => { sel.value = 'Sonnet 5'; setSeg($r('.abx-eff'), 'med'); },
    tools:() => { setSeg($('.seg2', $('[data-t="gmail"]', tools)), 'act'); setSeg($('.seg2', $('[data-t="linear"]', tools)), 'act'); setSeg($('.seg2', $('[data-t="slack"]', tools)), 'ask'); },
    know:() => { kn.innerHTML = `<span class="tag">${I('file-text','xs')}Refund policy.pdf</span><span class="tag">${I('globe','xs')}Help centre</span><span class="tag">${I('table','xs')}Team routing.csv</span>`; },
    trig:() => { $$('.abx-trs button', r).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === 'event')); $r('.abx-trs').dispatchEvent(new Event('resize')); swap(trd, TRIG.event); }
  };
  let drafting = false;
  go.onclick = () => c.run(async () => {
    if (drafting) return; if (!desc.value.trim()){ desc.focus(); return; }
    drafting = true; go.disabled = true; go.innerHTML = '<span class="spin"></span>Drafting'; sr.textContent = 'Drafting the agent';
    const keys = Object.keys(D); keys.forEach(k => S(k).classList.add('wait'));
    for (const k of keys){ const s = S(k); s.classList.remove('wait'); s.classList.add('busy'); await c.wait(550); await D[k](); s.classList.remove('busy');
      if (!tag(k)){ const t = html(`<span class="abx-dt">${I('spark','xs')}Drafted</span>`); $('.abx-sh', s).insertBefore(t, $('.abx-sh .muted', s)); enter(t); } }
    // the trigger switch was redrawn from code, so its knob is placed again
    const tk = $('.abx-trs .knob', r), tb = $('.abx-trs [aria-pressed="true"]', r); if (tk && tb){ tk.style.left = tb.offsetLeft + 'px'; tk.style.width = tb.offsetWidth + 'px'; }
    $$('.abx-tl .seg2', tools).forEach(g => { const k = $('.knob', g), b = $('[aria-pressed="true"]', g); if (k && b){ k.style.left = b.offsetLeft + 'px'; k.style.width = b.offsetWidth + 'px'; } });
    const ek = $('.abx-eff .knob', r), eb = $('.abx-eff [aria-pressed="true"]', r); if (ek && eb){ ek.style.left = eb.offsetLeft + 'px'; ek.style.width = eb.offsetWidth + 'px'; }
    state = 'dirty'; status('Drafted, not saved'); go.disabled = false; go.className = 'pill line sm abx-go'; go.innerHTML = `${I('refresh','xs')}Draft again`; test.disabled = false; drafting = false; valid(); sr.textContent = 'Drafted. Check the fields, then test it';
  });
  // a test: a sample email goes in, and the agent says what it would do with it
  test.onclick = () => c.run(async () => {
    test.disabled = true; swap(cs, 'Testing with a sample email');
    log.innerHTML = `<div class="abx-em"><b>I was charged twice for October</b><span>Hi, my card shows two charges of $48 on Oct 3. Can you refund one? Maya</span><span class="muted">maya@lumen.co · sample</span></div>`; enter(log.firstElementChild);
    await c.wait(700);
    // Dotto thinks while the agent replies
    think(true);
    const rp = html(`<div class="abx-rp"><span class="k">${mascot()}<span class="shim">Support triage is reading it</span></span></div>`); log.appendChild(rp); enter(rp);
    await c.wait(1300);
    think(false);
    rp.innerHTML = `<span class="k">${mascot()}Support triage</span><span class="tags"><span class="tag">Billing</span><span class="tag warn">High priority</span><span class="tag">Routed to Billing</span></span><span>Duplicate charge of $48 on Oct 3. I drafted a refund reply and will ask before sending it, as the instructions say.</span>`;
    enter(rp); swap(cs, 'The test passed'); test.disabled = false; sr.textContent = 'Test done: Billing, high priority, routed to Billing';
  });
  save.onclick = () => { if (!valid()) { name.focus(); return; } state = 'saved'; status(`${I('check','xs')}Saved`); sr.textContent = 'Saved'; valid(); };
  pub.onclick = () => c.run(async () => { if (!valid()) { name.focus(); return; } pub.innerHTML = '<span class="spin"></span>Publishing'; await c.wait(800); state = 'live'; status(`${mascot()}<span class="tag ok">Live</span>`, 'muted'); pub.textContent = 'Published'; valid(); sr.textContent = 'Published. The agent is live'; });
  // the preview's story: one sentence, the fields fill in, one test email, save, publish
  if (r === c.st) c.story(async s => {
    await s.beat(2);
    await s.point(desc, false); await s.type(desc, 'Triage support emails', { n:.12 }); await s.beat(1);
    await s.tap(go); s.away();
    await s.until(() => !drafting && state === 'dirty'); await s.beat(3);
    await s.tap(test); s.away(); await s.until(() => $('.abx-rp .tags', r)); await s.beat(4);
    await s.tap(save); await s.beat(2);
    await s.tap(pub); s.away(); await s.until(() => state === 'live'); await s.beat(6);
  });
});