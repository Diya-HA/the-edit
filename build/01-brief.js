const H = require('./helpers');
const { docTitle, subtitle, sectionLabel, subhead, para, bullet, callout, buildDoc, write, footerRule, spacer } = H;

const kids = [];
kids.push(...docTitle('One aesthetic, every brand', 'The Edit · Product Brief · Working title'));
kids.push(subtitle('A shopping app organised around a look instead of a store. It pulls real pieces from many brands into one cohesive, on-palette feed you can save, follow, and buy.'));

kids.push(sectionLabel('The problem'));
kids.push(para('People shop by aesthetic now: "clean girl," "quiet luxury," "soft romance," "quiet utility." They find the look on Pinterest or TikTok and then can\'t buy it in one place. Building one cohesive outfit means bouncing between ten brand sites, a resale app, and a folder of screenshots, then guessing whether it all hangs together. The inspiration sits in one app; the buying is scattered across many. What\'s left is a camera roll full of wants and a wardrobe of one-offs that don\'t work together.'));
kids.push(para('No shopping app is built around how this shopper actually thinks. Retailer apps carry one brand. Marketplaces sort by brand and category, not by look. Pinterest curates beautifully and sells nothing.'));

kids.push(sectionLabel('The idea'));
kids.push(para('Pick an aesthetic and the app curates real pieces from many brands into one cohesive, on-palette feed. Save pieces to mood boards, filter the whole feed by colour, follow a shelf of brands that fit your look, and get told when a saved piece drops in price. The curation, keeping the mix cohesive across brands, is the product. Everything around it is table stakes.'));
kids.push(para([{text:'Positioning: '},{text:'Pinterest you can actually shop. One aesthetic, every brand.', italic:true}]));

kids.push(spacer(40));
kids.push(callout(null, { label: 'The core bet', bg: H.REC_BG, paras: [
  [{text:'If we can curate cross-brand pieces into looks that feel genuinely cohesive, people will shop by aesthetic here instead of stitching it together across ten apps.', bold:true}],
  'Every item on the roadmap exists to prove or disprove that one sentence.',
] }));

kids.push(sectionLabel('Why it can win'));
kids.push(bullet([{text:'A real gap. ', bold:true},{text:'The two closest products each do half the job: Pinterest inspires but doesn\'t sell, retailers sell but don\'t curate across brands. Nobody owns "shop the look, across brands."'}]));
kids.push(bullet([{text:'Taste is the early advantage. ', bold:true},{text:'A coherent cross-brand feed is hard to assemble and hard to fake, so done well it is the reason people come back, and it should compound as we learn each shopper\'s eye. (Calling it a lasting moat on day one would be a stretch. The durable version is the cohesion data we gather, not the idea itself.)'}]));
kids.push(bullet([{text:'It rides a habit people already have. ', bold:true},{text:'People already shop by aesthetic. We are removing the friction between the mood board and the cart, not teaching a new behaviour.'}]));

kids.push(sectionLabel('Who it\'s for'));
kids.push(para('Aesthetic-driven shoppers, roughly 18 to 34, who already save fashion inspiration and will spend on it. They treat an "aesthetic" as part of their identity, care more about how pieces work together than about any single label, and are frustrated that inspiration and purchase live in different apps. Three personas carry the bet: Maya the aesthetic curator, Priya the deal-smart trend follower, and Sam the time-poor minimalist. They share one job: they pay for cohesion. Maya is the wedge we win first (see the personas document).'));

kids.push(sectionLabel('It\'s an agentic product by design'));
kids.push(para('The Edit is more than a catalogue with filters. It follows the shape of a modern agentic app. A shopper sets a configurable goal (aesthetic, palette, budget, occasion). A background agent plans and assembles a cohesive cross-brand set. It produces useful artifacts along the way: the feed, mood boards, price-drop alerts. And it adapts as the shopper saves, dismisses, and follows. The feed-curator prototype shows the engine; the visual prototype shows the experience around it.'));

kids.push(sectionLabel('What success looks like'));
kids.push(para([{text:'North Star: ', bold:true},{text:'cohesive looks saved and shopped, meaning a shopper assembling a multi-brand look they actually buy into.'}]));
kids.push(para([{text:'The one metric that carries the bet: ', bold:true},{text:'save-rate on the curated feed versus a plain multi-brand feed. If curation doesn\'t beat a shuffle, we don\'t have a product. Early signals to watch alongside it:'}]));
kids.push(bullet([{text:'Engagement: ', bold:true},{text:'saves per session, boards created, 7-day return.'}]));
kids.push(bullet([{text:'Intent: ', bold:true},{text:'outbound click-through and add-to-cart on brand links.'}]));
kids.push(bullet([{text:'Retention: ', bold:true},{text:'4-week return rate among people who created at least one board.'}]));
kids.push(para([{text:'Assumption: ', italic:true, color:H.ACCENT},{text:'we don\'t have baselines yet. These targets get set from the first tests, not asserted now.', italic:true, color:H.MUTE}]));

kids.push(sectionLabel('Business model & scope'));
kids.push(para([{text:'Assumption: ', italic:true, color:H.ACCENT},{text:'v1 earns through affiliate commission on the sales we drive to brand partners, so there is no inventory and no checkout to build. Later options include featured brand placements and a light subscription for power features. This is a working assumption, not a settled decision, and affiliate reach is itself a risk we are testing (see H6).'}]));
kids.push(para([{text:'v1 in: ', bold:true},{text:'curated feed with aesthetic modes, palette and category filtering, search with "more like this," mood boards, brand shelf with follow, price-drop alerts, outbound links to brand checkout.'}]));
kids.push(para([{text:'v1 out for now: ', bold:true},{text:'in-app checkout, user-to-user social, fit and size personalisation, our own logistics. Real, but not what proves the bet.'}]));

kids.push(sectionLabel('Open decisions'));
kids.push(para([{text:'My recommendation on each is below. All four stay open for you to decide.', italic:true, color:H.MUTE}]));
kids.push(callout(null, { bg: H.CHIP_BG, paras: [
  [{text:'Product name. ', bold:true},{text:'"The Edit" is a placeholder, and Net-a-Porter already runs an editorial brand called The Edit, so it would be hard to own. Recommendation: keep it as a codename while building, but pick something ownable before any public test.'}],
  [{text:'Business model. ', bold:true},{text:'Recommendation: affiliate for v1. It needs no inventory or checkout and lets us test demand fast. Watch thin margins and brands that don\'t offer affiliate.'}],
  [{text:'Curation at launch. ', bold:true},{text:'Recommendation: hand-curate the launch catalogue so taste is guaranteed, with the agent assisting behind the scenes, then hand it more as it proves out (H5). Taste is the whole bet; a mediocre first feed is the one thing we can\'t afford.'}],
  [{text:'Launch aesthetics. ', bold:true},{text:'Recommendation: launch with the two we\'ve prototyped, not a handful. Depth inside each aesthetic beats breadth early, and a thin catalogue reads as "not much here."'}],
] }));

kids.push(footerRule());
kids.push(para([{text:'The Edit — Product Brief', color:H.MUTE, size:16},{text:'          July 2026 · working draft for review', color:H.MUTE, size:16}]));

write(buildDoc(kids), './out/01-product-brief.docx');
