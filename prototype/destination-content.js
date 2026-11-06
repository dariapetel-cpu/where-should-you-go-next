/* Personalization is pure and deterministic; it never changes destination scores or answers. */
(function(root){'use strict';
const bundles={
 paris:[
  ['Eiffel Tower',['A picnic pause in the tower neighborhood','Study the tower’s ironwork from the Champ de Mars','Walk a comfortable section of the Champ de Mars','Watch the city settle into evening around the tower'],['b','a'], 'https://www.toureiffel.paris/en'],
  ['Seine riverbanks',['Look for a café near the river','Notice the bridge details along the Seine','Follow a short stretch of the riverbank','Take an early-evening riverside stroll'],['a','c'],'https://parisjetaime.com/eng/'],
  ['Montmartre café',['Make time for a neighborhood café','Explore Montmartre’s artistic streets','Choose a short walk through Montmartre','Enjoy the neighborhood’s evening atmosphere'],['b','d'],'https://parisjetaime.com/eng/']
 ],
 tokyo:[
  ['Asakusa',['Explore the local food traditions around Asakusa','Look closely at the temple architecture in Asakusa','Walk a manageable loop through the historic neighborhood','Explore Asakusa as lanterns begin to light'],['b','d'],'https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/'],
  ['Shibuya',['Look for a food stop in the Shibuya neighborhood','Notice the contemporary streetscape around Shibuya','Take a short neighborhood walk beyond the crossing','Explore Shibuya’s evening streets'],['d','b'],'https://www.gotokyo.org/en/story/walks-and-tours/best-of-tokyo/index.html'],
  ['Sumida riverfront',['Pause for a snack before a riverfront stroll','Look at the bridges along the Sumida','Leave space for a riverside walk','Enjoy the riverfront in the early evening'],['c','a'],'https://www.gotokyo.org/en/destinations/eastern-tokyo/index.html']
 ],
 bali:[
  ['Sanur coast',['Make a relaxed local food stop near Sanur','Explore the coastal neighborhood at an unhurried pace','Walk a short stretch of the Sanur shoreline','Enjoy a calm coastal evening in Sanur'],['a','c'],'https://www.indonesia.travel/id/en/destination/bali-nusa-tenggara/bali/sanur0'],
  ['Ubud',['Explore Ubud’s food traditions','Make Ubud’s artistic traditions your focus','Choose a comfortable outdoor neighborhood route','Look into a local cultural performance; verify the schedule'],['b','d'],'https://www.indonesia.travel/id/en/destination/bali-nusa-tenggara/bali'],
  ['Tegalalang terraces',['Pause for a local meal in the wider Ubud area','Learn about the cultural landscape around the terraces','Enjoy a terrace viewpoint; check route conditions','Choose a daylight terrace visit and a quiet evening afterward'],['c','b'],'https://www.indonesia.travel/id/en/destination/bali-nusa-tenggara/bali']
 ],
 'swiss-alps':[
  ['Zermatt village',['Leave time for a village food stop','Notice Zermatt’s timber architecture','Take a comfortable village walk','Enjoy the village’s early-evening atmosphere'],['b','d'],'https://zermatt.swiss/en'],
  ['Matterhorn viewpoints',['Pair a suitable viewpoint with a relaxed meal break','Look for local interpretation of the mountain landscape','Choose a viewpoint suited to weather and your ability','Prioritize daylight mountain views, then return to the village'],['c','b'],'https://zermatt.swiss/en'],
  ['Stellisee',['Bring a suitable picnic if the route is accessible','Look at the landscape reflected in the lake','Consider the lake only after checking seasonal access and ability','Plan the lake in daylight; keep the evening in the village'],['c','a'],'https://www.myswitzerland.com/en-us/destinations/lake-stelli/']
 ]};
function personalize(destination,answers){
 const rows=bundles[destination.id]||destination.attractions.map(name=>[name,[`Explore food traditions around ${name}`,`Look for architectural and cultural details around ${name}`,`Choose a suitable outdoor route around ${name}`,`Explore the early-evening atmosphere around ${name}`],['b','c'],destination.source]);
 const index='abcd'.indexOf(answers.interests),packing={a:'Camera: leave a pause for photographs.',b:'Walking shoes: choose a manageable local walking route.',c:'A book: keep a quiet reading break.',d:'Food journal: note a local flavor or food tradition.'}[answers.packing];
 const company={a:'Make room for your own discoveries.',b:'Leave a shared pause between activities.',c:'Agree on a group meeting point and break.',d:'Choose comfortable breaks for everyone.'}[answers.companions];
 const priorities=rows.map((r,i)=>({i,weight:(r[2].includes(answers.dream)?4:0)+(r[2].includes(answers.vacation)?2:0)+(i==={a:2,b:0,c:1,d:2}[answers.interests]?3:0)+(i==={a:1,b:2,c:0,d:2}[answers.packing]?1:0)})).sort((a,b)=>b.weight-a.weight||a.i-b.i);
 const activities=rows.map((r,i)=>({index:i,place:r[0],title:r[1][index],source:r[3]}));
 const days=priorities.map(({i},day)=>({day:day+1,...activities[i],pace:{a:'One main stop, a long break, and the rest left open.',b:'One main stop, a break, and a nearby neighborhood pause.',c:'Add a nearby discovery after a break; avoid distant detours.',d:'Keep one anchor, then follow a nearby discovery if you wish.'}[answers.pace],packing,company,budget:answers.budget==='a'?'Prioritize the surrounding area; verify entry or transport costs before committing.':answers.budget==='c'?'Consider one special experience after checking availability and costs.':'Check access and costs before visiting.',transfer:destination.id==='bali'&&i!==0?'Plan a separate Ubud-area day and allow road transfer time from Sanur.':destination.id==='swiss-alps'&&i!==0?'Mountain access depends on season, weather, transport and ability; use a village day if unsuitable.':'Keep the day in this neighborhood; check routes and access.'}));
 return {activities,days};
}
root.DestinationContent={bundles,personalize};if(typeof module!=='undefined')module.exports=root.DestinationContent;
})(typeof window!=='undefined'?window:globalThis);
