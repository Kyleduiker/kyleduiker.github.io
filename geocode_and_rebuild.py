"""
Run this script on your local machine.
It will geocode all Calgary communities and rebuild all 9 HTML pages
with precise coordinates.

Requirements: Python 3 (no extra packages needed)
Usage: python geocode_and_rebuild.py
Output: A folder called 'calgary-pages-geocoded/' with all 9 HTML files
"""

import urllib.request
import urllib.parse
import json
import time
import os
import re

# ── CONFIG ──────────────────────────────────────────────────────────────────
import os
API_KEY      = os.environ.get("GOOGLE_MAPS_API_KEY", "")
GUIDE_BASE   = "https://guide.duikerproperties.com"
IDX_BASE     = "https://www.duikerproperties.com/index.php?advanced=1&display={display}&min=0&max=100000000&beds=0&baths=0&types%5B%5D=1&types%5B%5D=2&types%5B%5D=31&minfootage=0&maxfootage=30000&minacres=0&maxacres=0&yearbuilt=0&maxyearbuilt=0&walkscore=0&keywords=&areas%5B%5D=neighbourhood%3A{area}%3Aab&sortby=listings.visits+DESC&rtype=grid"
IDX_URL      = "https://www.duikerproperties.com/idx"
CONTACT_URL  = "https://duikerproperties.com/contact"
PHONE        = "tel:4037973384"
PHONE_DISPLAY = "(403) 797-3384"
COMM_BASE    = "/calgary/communities"

# ── COMMUNITY DATA ───────────────────────────────────────────────────────────
COMMUNITIES = {
    "city-center": [
        ("Beltline","beltline","Urban condos, vibrant streets, and walkable city living"),
        ("Bridgeland","bridgeland","Charming inner-city neighbourhood with local cafes and city views"),
        ("Chinatown","chinatown","Historic cultural district steps from downtown"),
        ("Crescent Heights","crescent-heights","Hilltop community with panoramic downtown views"),
        ("Downtown Core","downtown-core","Calgary's central business and entertainment hub"),
        ("East Village","east-village","Revitalized urban district with modern condos and culture"),
        ("Downtown West End","downtown-west-end","Quiet residential west side of the downtown core"),
        ("Eau Claire","eau-claire","Riverside living with Bow River pathway access"),
        ("Erlton","erlton","Small inner-city community near the Stampede grounds"),
        ("Hillhurst","hillhurst","Character homes and walkable streets in the inner city"),
        ("Hounsfield Heights / Briar Hill","hounsfield-heights","Elevated community with established character homes"),
        ("Inglewood","inglewood","Calgary's oldest neighbourhood — artsy, eclectic, and walkable"),
        ("Killarney / Glengarry","killarney-glengarry","Established inner-city community with infill growth"),
        ("Lower Mount Royal","lower-mount-royal","Prestigious inner-city living near 17th Ave"),
        ("Montgomery","montgomery","Riverside community with a village feel"),
        ("Parkdale","parkdale","Mature inner-city neighbourhood near Foothills Hospital"),
        ("Point McKay","point-mckay","Riverfront community with a resort-like setting"),
        ("Queens Park Village","queens-park-village","Quiet pocket community in the inner city"),
        ("Renfrew","renfrew","Established neighbourhood with a mix of housing styles"),
        ("Rosedale","rosedale","Tree-lined streets and character homes near SAIT"),
        ("Rosemont","rosemont","Mature inner-city community with strong community spirit"),
        ("Roxboro","roxboro","Prestigious riverside community with luxury homes"),
        ("Scarboro / Sunalta West","scarboro-sunalta-west","Quiet inner-city with easy downtown access"),
        ("St. Andrews Heights","st-andrews-heights","Elevated community near Foothills Medical Centre"),
        ("Sunnyside","sunnyside","Vibrant pocket community next to Kensington village"),
        ("Sunalta","sunalta","Affordable inner-city with CTrain access"),
        ("Tuxedo Park","tuxedo-park","Mature north inner-city with character bungalows"),
        ("Upper Mount Royal","upper-mount-royal","One of Calgary's most prestigious established neighbourhoods"),
        ("West Hillhurst","west-hillhurst","Family-friendly inner west with strong community identity"),
        ("Winston Heights / Mountview","winston-heights","Established community with great downtown proximity"),
    ],
    "east": [
        ("Abbeydale","abbeydale","Established east community with family-sized homes"),
        ("Albert Park / Radisson Heights","albert-park","Long-standing community with solid value"),
        ("Applewood Park","applewood-park","Family-friendly with mature landscaping"),
        ("Belvedere","belvedere","Growing east community near Stoney Trail"),
        ("Castleridge","castleridge","Established NE-adjacent community with good access"),
        ("Dover","dover","Affordable entry-level options close to amenities"),
        ("Erin Woods","erin-woods","Quiet residential streets in east Calgary"),
        ("Falconridge","falconridge","Long-standing family community with solid fundamentals"),
        ("Forest Heights","forest-heights","Mature east community with established trees"),
        ("Forest Lawn","forest-lawn","Vibrant, diverse community with practical value"),
        ("Marlborough","marlborough","Transit-connected with good city access"),
        ("Marlborough Park","marlborough-park","Quiet residential adjacent to Marlborough"),
        ("Martindale","martindale","Established NE community with strong transit links"),
        ("Mayland Heights","mayland-heights","Elevated east community with city views"),
        ("Penbrooke Meadows","penbrooke-meadows","Residential community with practical pricing"),
        ("Pineridge","pineridge","Family homes with mature parks and good access"),
        ("Red Carpet","red-carpet","Small east community near the airport corridor"),
        ("Rundle","rundle","Established community with ring road proximity"),
        ("Southview","southview","Quiet residential with easy access to downtown"),
        ("Sunridge","sunridge","Commercial corridor community with retail access"),
        ("Temple","temple","Family-friendly established east community"),
        ("Valleyfield","valleyfield","Residential community in east Calgary"),
        ("Vista Heights","vista-heights","Elevated community with views across the city"),
        ("Whitehorn","whitehorn","Established community with good transit links"),
    ],
    "west": [
        ("Aspen Woods","aspen-woods","Premium homes with top school catchments"),
        ("Christie Park","christie-park","Established west community with good city access"),
        ("Coach Hill","coach-hill","Mature community with generous lots and views"),
        ("Cougar Ridge","cougar-ridge","Newer development with mountain proximity"),
        ("Crestmont","crestmont","Small community with a semi-rural feel"),
        ("Discovery Ridge","discovery-ridge","Nature-adjacent community beside Griffith Woods"),
        ("Glamorgan","glamorgan","Established south-west community near MRU"),
        ("Glenbrook","glenbrook","Mature community with solid single-family stock"),
        ("Glendale","glendale","Affordable west community with established character"),
        ("Lakeview","lakeview","Mature community near Glenmore Reservoir"),
        ("Lincoln Park","lincoln-park","West community near CFB Calgary"),
        ("Meadowlark Park","meadowlark-park","Quiet residential with mature trees"),
        ("North Glenmore Park","north-glenmore-park","Established community beside the reservoir"),
        ("Oakridge","oakridge","Mature trees and solid single-family stock"),
        ("Patterson","patterson","Hillside views and established west-side character"),
        ("Rosscarrock","rosscarrock","Affordable inner-west with good transit access"),
        ("Rutland Park","rutland-park","Quiet, mature community near MRU"),
        ("Scarboro","scarboro","Prestigious inner-city adjacent to the west"),
        ("Signal Hill","signal-hill","Established family community with great views"),
        ("Springbank Hill","springbank-hill","Semi-rural feel with luxury properties"),
        ("Spruce Cliff","spruce-cliff","Riverside community with Edworthy Park access"),
        ("Strathcona Park","strathcona-park","Quiet, central with excellent west-side access"),
        ("Valley Ridge","valley-ridge","Scenic community beside the Bow River valley"),
        ("West Springs","west-springs","Upscale neighbourhood with a growing hub"),
        ("Westgate","westgate","Established community with CTrain proximity"),
        ("Wildwood","wildwood","Mature community with Edworthy Park access"),
        ("Woodlands","woodlands","Established south-west community near Fish Creek"),
    ],
    "north": [
        ("Beddington Heights","beddington-heights","Established community with mature infrastructure"),
        ("Country Hills","country-hills","Well-rounded north community with full amenities"),
        ("Country Hills Village","country-hills-village","Quieter pocket within the Country Hills area"),
        ("Coventry Hills","coventry-hills","Family homes with good school proximity"),
        ("Edgemont","edgemont","Elevated views and mature community character"),
        ("Evanston","evanston","Thoughtfully designed newer community"),
        ("Glacier Ridge","glacier-ridge","New community on Calgary's north edge"),
        ("Greenview","greenview","Established north community close to the city"),
        ("Harvest Hills","harvest-hills","Established community with easy ring road access"),
        ("Hidden Valley","hidden-valley","Quiet north community with natural surroundings"),
        ("Highwood","highwood","Mature north community near Nose Hill"),
        ("Huntington Hills","huntington-hills","Long-standing family community in the north"),
        ("Kincora","kincora","Newer development with strong community amenities"),
        ("Livingston","livingston","Master-planned community with future HOA"),
        ("MacEwan Glen","macewan-glen","Established community with mature landscaping"),
        ("Nolan Hill","nolan-hill","Contemporary homes with rapid growth"),
        ("North Haven","north-haven","Well-established family neighbourhood"),
        ("Panorama Hills","panorama-hills","Large, amenity-rich family community"),
        ("Ranchlands","ranchlands","Mature community with established character"),
        ("Rocky Ridge","rocky-ridge","Scenic community with mountain views"),
        ("Royal Oak","royal-oak","Established and amenity-rich suburb"),
        ("Royal Vista","royal-vista","Newer community adjacent to Royal Oak"),
        ("Sage Hill","sage-hill","Newer suburban community on the north edge"),
        ("Sandstone Valley","sandstone-valley","Established community near Nose Hill Park"),
        ("Scenic Acres","scenic-acres","Mature community with great north-city views"),
        ("Silver Springs","silver-springs","Established community beside the Bow River"),
        ("Symons Valley Ranch","symons-valley-ranch","Rural-feel acreage community north of the city"),
        ("Thorncliffe","thorncliffe","Long-standing family community in the north"),
    ],
    "north-east": [
        ("Cityscape","cityscape","Modern community with contemporary streetscapes"),
        ("Coral Springs","coral-springs","Newer community near Stoney Trail"),
        ("Cornerstone","cornerstone","Newest NE master-planned community"),
        ("Homestead","homestead","Newer NE community with modern home designs"),
        ("Horizon","horizon","Established NE community near airport corridor"),
        ("Martindale","martindale","Established NE community with strong transit links"),
        ("McCall North","mccall-north","Community near the airport with good access"),
        ("Meridian","meridian","Developing community in northeast Calgary"),
        ("Monterey Park","monterey-park","Established NE family community"),
        ("Redstone","redstone","Newer development with contemporary homes"),
        ("Saddle Ridge","saddle-ridge","Modern master-planned community, growing fast"),
        ("Saddlecrest","saddlecrest","Quiet established streets in the NE"),
        ("Skyview Ranch","skyview-ranch","Newer community with excellent ring road access"),
        ("Taradale","taradale","Established NE community with full amenities"),
        ("Westwinds","westwinds","Established NE community with good transit"),
    ],
    "north-west": [
        ("Arbour Lake","arbour-lake","NW lake community with beach access"),
        ("Bowness","bowness","Historic community beside the Bow River"),
        ("Brentwood","brentwood","Established community near the University"),
        ("Cambrian Heights","cambrian-heights","Quiet elevated community in the inner NW"),
        ("Capitol Hill","capitol-hill","Mature inner-city community near SAIT"),
        ("Charleswood","charleswood","Established NW community with mature trees"),
        ("Citadel","citadel","Family suburb with parks and good north access"),
        ("Collingwood","collingwood","Mature inner-NW community near the university"),
        ("Dalhousie","dalhousie","Established, transit-connected with CTrain access"),
        ("Hawkwood","hawkwood","Mature trees and strong community character"),
        ("Highland Park","highland-park","Established inner NW community"),
        ("Mount Pleasant","mount-pleasant","Mature inner-city north community"),
        ("Ranchlands","ranchlands","Mature community with established character"),
        ("Scenic Acres","scenic-acres","Mature community with great views"),
        ("Silver Springs","silver-springs","Established community beside the Bow River"),
        ("Tuscany","tuscany","Scenic family community with mountain views"),
        ("University District","university-district","Modern urban community beside U of C"),
        ("University Heights","university-heights","Established community near U of C campus"),
        ("Varsity","varsity","U of C proximity and solid long-term resale value"),
        ("West Hillhurst","west-hillhurst","Family-friendly inner west identity"),
    ],
    "south": [
        ("Acadia","acadia","Mature south community with solid fundamentals"),
        ("Altadore","altadore","Inner-city gem with walkable streets and character homes"),
        ("Bankview","bankview","Hillside views and inner-city convenience"),
        ("Bayview","bayview","Small community near Glenmore Reservoir"),
        ("Bel-Aire","bel-aire","Prestigious south community with estate homes"),
        ("Braeside","braeside","Established south community near Fish Creek"),
        ("Bridlewood","bridlewood","Family suburb with great school and park access"),
        ("Britannia","britannia","Prestigious community overlooking the Elbow River"),
        ("Canyon Meadows","canyon-meadows","Established family community near Fish Creek"),
        ("Cedarbrae","cedarbrae","Practical south community with solid infrastructure"),
        ("Chinook Park","chinook-park","Mature south community with established character"),
        ("Eagle Ridge","eagle-ridge","Quiet south community with executive homes"),
        ("Elbow Park","elbow-park","Prestigious inner-south beside the Elbow River"),
        ("Elboya","elboya","Established inner south with character homes"),
        ("Erlton","erlton","Inner-city community near the Stampede grounds"),
        ("Evergreen","evergreen","Quiet, established suburb — complete and well-maintained"),
        ("Garrison Green","garrison-green","Modern infill community on former base land"),
        ("Garrison Woods","garrison-woods","Popular inner-south infill community"),
        ("Haysboro","haysboro","Affordable mature community with good transit"),
        ("Kingsland","kingsland","Established community near Chinook Centre"),
        ("Lake Bonavista","lake-bonavista","Calgary's original lake community"),
        ("Mayfair","mayfair","Mature inner south with character homes"),
        ("Meadowlark Park","meadowlark-park","Quiet residential with mature trees"),
        ("Millrise","millrise","Established family community near Fish Creek"),
        ("Mission","mission","Vibrant inner-city community on 4th St SW"),
        ("Oakridge","oakridge","Mature trees and solid single-family housing"),
        ("Palliser","palliser","Established south community near Glenmore"),
        ("Parkhill","parkhill","Small inner south community with city views"),
        ("Pump Hill","pump-hill","Prestigious south community with estate homes"),
        ("Rideau Park","rideau-park","Quiet inner-south community near the Elbow"),
        ("Riverbend","riverbend","Established SE-adjacent community near Fish Creek"),
        ("Shawnee Slopes","shawnee-slopes","South community with Fish Creek access"),
        ("Shawnessy","shawnessy","Transit-connected with mature retail hub"),
        ("Silverado","silverado","Accessible pricing on the south edge"),
        ("Somerset","somerset","Well-connected south suburb with CTrain access"),
        ("South Calgary","south-calgary","Inner-south community near Marda Loop"),
        ("Southwood","southwood","Established south community with practical value"),
        ("Windsor Park","windsor-park","Prestigious inner south near Britannia"),
        ("Woodbine","woodbine","Established south community near Fish Creek"),
        ("Yorkville","yorkville","New south community near Spruce Meadows Trail"),
    ],
    "south-east": [
        ("Auburn Bay","auburn-bay","Established lake living with excellent resale history"),
        ("Belmont","belmont","Newer SE community growing along the south edge"),
        ("Bonavista Downs","bonavista-downs","Established SE community near Lake Bonavista"),
        ("Chaparral","chaparral","Lake community with a strong family identity"),
        ("Copperfield","copperfield","Established SE community with parks and amenities"),
        ("Cranston","cranston","Nature access, ravines, and premium home options"),
        ("Deer Ridge","deer-ridge","Established SE community near Deer Run"),
        ("Deer Run","deer-run","Quiet SE community with Fish Creek access"),
        ("Diamond Cove","diamond-cove","Exclusive gated community beside Fish Creek"),
        ("Douglasdale / Glen","douglasdale-glen","Established community with golf course access"),
        ("Fairview","fairview","Established SE community near Deerfoot"),
        ("Hotchkiss","hotchkiss","New SE community on the city's south edge"),
        ("Legacy","legacy","Newer family community growing rapidly"),
        ("Mahogany","mahogany","Calgary's largest lake community — beach and lifestyle"),
        ("Maple Ridge","maple-ridge","Established SE community near golf"),
        ("McKenzie Lake","mckenzie-lake","Established lake community with strong resale"),
        ("McKenzie Towne","mckenzie-towne","Traditional town design with community identity"),
        ("Midnapore","midnapore","Established lake community near Fish Creek"),
        ("New Brighton","new-brighton","Family community with private club amenities"),
        ("Ogden","ogden","Established SE community close to the city"),
        ("Parkland","parkland","Established SE community near Fish Creek"),
        ("Pine Creek","pine-creek","Developing SE community near Spruce Meadows"),
        ("Queensland","queensland","Established SE community near Fish Creek"),
        ("Ramsay","ramsay","Inner-SE community near the Stampede grounds"),
        ("Rangeview","rangeview","New SE community with agriculture-themed design"),
        ("Riverbend","riverbend","Established community near Fish Creek"),
        ("Seton","seton","Calgary's newest urban district — South Health Campus hub"),
        ("Sundance","sundance","Established SE lake community"),
        ("Walden","walden","Newer SE community with environmental focus"),
        ("Willow Park","willow-park","Mature SE community near golf"),
        ("Wolf Willow","wolf-willow","New SE community beside the Bow River"),
    ],
}

MAP_CONFIG = {
    "city-center":  (51.0467, -114.0756, 13),
    "east":         (51.0645, -114.0045, 12),
    "west":         (51.0267, -114.1756, 12),
    "north":        (51.1456, -114.1023, 12),
    "north-east":   (51.1312, -113.9712, 12),
    "north-west":   (51.1156, -114.1756, 12),
    "south":        (50.9934, -114.0934, 12),
    "south-east":   (50.9300, -114.0250, 12),
}

all_quadrants = [
    {"label":"All Calgary","title":"Calgary","url":"/calgary/","hub":True},
    {"label":"Quadrant","title":"City Centre","url":"/calgary/city-center/"},
    {"label":"Quadrant","title":"East","url":"/calgary/east/"},
    {"label":"Quadrant","title":"West","url":"/calgary/west/"},
    {"label":"Quadrant","title":"North","url":"/calgary/north/"},
    {"label":"Quadrant","title":"Northeast","url":"/calgary/north-east/"},
    {"label":"Quadrant","title":"Northwest","url":"/calgary/north-west/"},
    {"label":"Quadrant","title":"South","url":"/calgary/south/"},
    {"label":"Quadrant","title":"Southeast","url":"/calgary/south-east/"},
]

pages = [
    {"filename":"calgary.html","comm_key":"","url":"/calgary/","title":"Calgary Real Estate | All Quadrants | Duiker Properties","meta":"Explore Calgary real estate by quadrant.","eyebrow":"Calgary Real Estate","h1_top":"Find Your Place in","h1_em":"Calgary","subhead":"Calgary is one of Canada's most dynamic cities — a place where urban energy meets open sky. Whether you're drawn to a downtown condo, a family home in the south, or a lakeside community in the southeast, I'll help you find the right fit.","about_eyebrow":"About Calgary","about_title":"A City of","about_title_em":"Neighbourhoods","about_p1":"Calgary is divided into distinct quadrants — each with its own character, amenity mix, and price range. Understanding which quadrant aligns with your lifestyle is the first step toward finding the right home.","about_p2":"As a Broker specializing in Southeast Calgary with deep roots across the city, I help buyers and sellers navigate every part of Calgary with clarity and confidence.","features":["Diverse communities across all price points","Strong infrastructure and amenity growth","Easy access to the Rocky Mountains","Thriving job market and growing population"],"highlight_title":"Explore by Quadrant","highlights":["City Centre — urban living, walkable districts","East — established value, diverse communities","West — foothills access, mature neighbourhoods","North — new development, family communities","NE — multicultural vibrancy, transit access","NW — universities, parks, mature trees","South — top schools, established suburbs","SE — lake communities, new builds, Seton"],"cta_h2_top":"Ready to Explore","cta_h2_em":"Calgary?","cta_p":"Whether you're buying, selling, or just starting to explore, I'm here to help you navigate Calgary's real estate market with confidence."},
    {"filename":"calgary-city-center.html","comm_key":"city-center","url":"/calgary/city-center/","title":"Calgary City Centre Real Estate | Duiker Properties","meta":"Explore real estate in Calgary's City Centre.","eyebrow":"Calgary City Centre","h1_top":"Live at the Heart of","h1_em":"Calgary","subhead":"Calgary's City Centre offers a walkable, vibrant urban lifestyle with easy access to restaurants, arts, parks along the Bow, and the city's professional core.","about_eyebrow":"City Centre","about_title":"Urban Living,","about_title_em":"Downtown Energy","about_p1":"The City Centre quadrant encompasses Calgary's downtown core and surrounding inner-city neighbourhoods — from Beltline's condo towers to the charming streets of Kensington and Inglewood.","about_p2":"Condos, lofts, and townhomes are the primary property types here, appealing to young professionals, downsizers, and investors looking for central location and walkability.","features":["Walkable to offices, restaurants, and the Bow River Pathway","Condo and loft-style living options","Close to cultural venues and entertainment","Strong rental demand for investors"],"highlight_title":"Neighbourhoods to Know","highlights":["Beltline — high-density condo living, vibrant streets","Kensington — boutique shops, cafes, community feel","Eau Claire — riverside living, peace in the city","Inglewood — Calgary's oldest neighbourhood, artsy vibe","East Village — revitalized, contemporary urban hub","Bridgeland — charming, walkable, local favourites"],"cta_h2_top":"Find Your Home in","cta_h2_em":"City Centre","cta_p":"Let's talk about what urban living looks like for you. I'll help you find the right building, the right suite, and the right fit."},
    {"filename":"calgary-east.html","comm_key":"east","url":"/calgary/east/","title":"Calgary East Real Estate | Duiker Properties","meta":"Explore Calgary East real estate.","eyebrow":"Calgary East","h1_top":"Established Value in","h1_em":"Calgary East","subhead":"Calgary East is a diverse, established part of the city offering strong value, well-connected transit, and communities with deep roots.","about_eyebrow":"Calgary East","about_title":"Community Roots,","about_title_em":"Real Value","about_p1":"Calgary's East quadrant is home to a wide mix of housing styles and price points — from entry-level bungalows to well-kept family homes.","about_p2":"Many of Calgary's east-side communities are multicultural, vibrant, and well-served by transit routes and major corridors connecting to downtown and the ring road.","features":["Strong value relative to other quadrants","Established neighbourhoods with mature trees","Good transit access to downtown","Diverse housing stock and community demographics"],"highlight_title":"Neighbourhoods to Know","highlights":["Forest Lawn — long-standing community, practical value","Applewood Park — family-friendly, established streets","Marlborough — transit-connected, central east location","Penbrooke Meadows — quiet residential, good access","Dover — affordable entry-level opportunities","Rundle — mature community, ring road access"],"cta_h2_top":"Discover What's Available in","cta_h2_em":"Calgary East","cta_p":"East Calgary has more to offer than many buyers realize. Let's find out if it's the right fit for your next move."},
    {"filename":"calgary-west.html","comm_key":"west","url":"/calgary/west/","title":"Calgary West Real Estate | Duiker Properties","meta":"Calgary West real estate — mature neighbourhoods, foothills views.","eyebrow":"Calgary West","h1_top":"Mountains Close,","h1_em":"City at Your Door","subhead":"Calgary West sits at the edge of the foothills, offering mature neighbourhoods, strong schools, and some of the most scenic commutes in any major Canadian city.","about_eyebrow":"Calgary West","about_title":"Mature Communities,","about_title_em":"Foothills Character","about_p1":"West Calgary is defined by its well-established neighbourhoods, generous lot sizes, and easy access to both the city centre and the Rocky Mountains.","about_p2":"Buyers are drawn to Calgary West for its school options, transit corridors, and the outdoor lifestyle that comes with proximity to Nose Hill Park, Edworthy Park, and the Bow River pathway system.","features":["Close proximity to Kananaskis and Banff","Mature neighbourhoods with established trees","Access to strong school communities","Mix of single-family homes and condos"],"highlight_title":"Neighbourhoods to Know","highlights":["Signal Hill — established, family-friendly, great views","Cougar Ridge — newer development, mountain proximity","West Springs — upscale, growing community hub","Strathcona Park — mature, quiet, central west","Aspen Woods — premium homes, top school catchments","Springbank Hill — semi-rural feel, luxury properties"],"cta_h2_top":"Explore Homes in","cta_h2_em":"Calgary West","cta_p":"West Calgary offers a lifestyle that's hard to match — mature, scenic, and well-connected."},
    {"filename":"calgary-north.html","comm_key":"north","url":"/calgary/north/","title":"Calgary North Real Estate | Duiker Properties","meta":"Explore real estate in Calgary North — growing communities, family amenities.","eyebrow":"Calgary North","h1_top":"Room to Grow in","h1_em":"Calgary North","subhead":"Calgary North is one of the city's fastest-growing areas — with a mix of newer suburban communities and established neighbourhoods that offer space, amenities, and solid value for families.","about_eyebrow":"Calgary North","about_title":"Space, Value,","about_title_em":"Community Growth","about_p1":"North Calgary offers a broad range of housing options from well-priced townhomes to detached family homes in newer developments.","about_p2":"Access to Nose Hill Park, strong school options, and improving transit make North Calgary a compelling choice for families and first-time buyers.","features":["Newer communities with modern amenities","Proximity to Nose Hill Park","Growing commercial and retail corridors","Competitive pricing relative to south Calgary"],"highlight_title":"Neighbourhoods to Know","highlights":["Panorama Hills — large, established, family-centred","Evanston — newer, community-focused design","Nolan Hill — contemporary homes, strong growth","Livingston — master-planned, amenity-rich","Harvest Hills — established north community","Coventry Hills — family homes, good school proximity"],"cta_h2_top":"Find Your Home in","cta_h2_em":"Calgary North","cta_p":"North Calgary's growth story is still being written. Let's find out if one of its communities is the right place for your next chapter."},
    {"filename":"calgary-north-east.html","comm_key":"north-east","url":"/calgary/north-east/","title":"Calgary NE Real Estate | Duiker Properties","meta":"Real estate in Calgary's Northeast — multicultural communities, transit-connected.","eyebrow":"Calgary Northeast","h1_top":"Vibrant Communities in","h1_em":"Calgary NE","subhead":"Calgary's Northeast is one of the city's most culturally diverse and rapidly evolving quadrants — well-connected by transit, rich in community, and offering some of Calgary's most accessible entry points to homeownership.","about_eyebrow":"Calgary NE","about_title":"Culture, Connection,","about_title_em":"Great Access","about_p1":"The Northeast quadrant is home to some of Calgary's most established multicultural communities alongside newer suburbs.","about_p2":"Buyers are drawn here for the value, the diversity of food and culture, and the easy access to YYC International Airport and the CTrain network.","features":["Strong transit connectivity including CTrain access","Some of Calgary's best ethnic food and markets","Close proximity to YYC International Airport","Entry-level pricing with solid resale history"],"highlight_title":"Neighbourhoods to Know","highlights":["Saddle Ridge — master-planned, modern, growing fast","Taradale — established NE community, amenity-rich","Skyview Ranch — newer community, great ring road access","Falconridge — long-standing, family-oriented","Martindale — strong transit, diverse community","Redstone — newer development, contemporary homes"],"cta_h2_top":"Explore Listings in","cta_h2_em":"Calgary NE","cta_p":"The Northeast is often underrated. Let's look at what's available and whether it's the right fit for your goals."},
    {"filename":"calgary-north-west.html","comm_key":"north-west","url":"/calgary/north-west/","title":"Calgary NW Real Estate | Duiker Properties","meta":"Calgary NW real estate — universities, parks, mature communities.","eyebrow":"Calgary Northwest","h1_top":"Parks, Schools &","h1_em":"Calgary NW","subhead":"Calgary's Northwest quadrant blends established mature neighbourhoods with newer suburban growth — all anchored by strong school options, Nose Hill Park, and the University of Calgary.","about_eyebrow":"Calgary NW","about_title":"Academic Roots,","about_title_em":"Natural Surroundings","about_p1":"Northwest Calgary is anchored by the University of Calgary and Foothills Medical Centre, making it a hub for students, medical professionals, and families.","about_p2":"The quadrant ranges from established inner-city communities like Capitol Hill to newer northwest suburbs, offering a wide spectrum of home styles and price points.","features":["University of Calgary and Foothills Medical Centre nearby","Extensive Bow River pathway and Nose Hill access","Strong school catchments throughout","Mix of older character homes and new construction"],"highlight_title":"Neighbourhoods to Know","highlights":["Tuscany — family-friendly, great mountain views","Royal Oak — established, amenity-rich NW suburb","Hawkwood — mature trees, strong community character","Varsity — university proximity, solid resale value","Citadel — family suburb, great north access","Dalhousie — established, transit-connected, CTrain access"],"cta_h2_top":"Find Your Home in","cta_h2_em":"Calgary NW","cta_p":"From inner-city character homes to northwest suburbs, I can help you navigate NW Calgary's diverse market with confidence."},
    {"filename":"calgary-south.html","comm_key":"south","url":"/calgary/south/","title":"Calgary South Real Estate | Duiker Properties","meta":"Explore South Calgary real estate — established communities, top schools.","eyebrow":"Calgary South","h1_top":"Established Living in","h1_em":"Calgary South","subhead":"South Calgary is known for its mature communities, top-rated schools, and strong family-oriented lifestyle.","about_eyebrow":"Calgary South","about_title":"Schools, Stability,","about_title_em":"South Calgary","about_p1":"The South quadrant has long been a destination for families prioritizing school catchments, community character, and established infrastructure.","about_p2":"From the inner-city charm of Altadore and Marda Loop to the mature suburbs of Shawnessy and Evergreen, South Calgary covers a broad range of lifestyles and price points.","features":["Consistently top-ranked school communities","Easy access to MacLeod Trail and Glenmore Trail","Variety of housing from bungalows to modern infills","Strong long-term resale performance"],"highlight_title":"Neighbourhoods to Know","highlights":["Altadore / Marda Loop — inner-city, walkable, vibrant","Bridlewood — family suburb, great school access","Evergreen — established, quiet, amenity-complete","Shawnessy — transit-connected, established retail hub","Oakridge — mature trees, solid single-family stock","Lake Bonavista — Calgary's original lake community"],"cta_h2_top":"Browse Homes in","cta_h2_em":"Calgary South","cta_p":"South Calgary's appeal is enduring. Let's explore which community aligns with what you're looking for."},
    {"filename":"calgary-south-east.html","comm_key":"south-east","url":"/calgary/south-east/","title":"Calgary Southeast Real Estate | Mahogany, Auburn Bay, Seton | Duiker Properties","meta":"Calgary Southeast real estate — lake communities, new builds, Seton Urban District.","eyebrow":"Calgary Southeast","h1_top":"Lake Communities &","h1_em":"Southeast Calgary","subhead":"Calgary's Southeast is home to some of the city's most sought-after lake communities and the rapidly growing Seton Urban District.","about_eyebrow":"Calgary SE","about_title":"Lakes, New Builds,","about_title_em":"Seton District","about_p1":"Southeast Calgary has become one of the city's most desirable areas for new home buyers and upgraders alike. Communities like Mahogany, Auburn Bay, and Cranston offer private lake access, strong amenity packages, and modern housing options.","about_p2":"As a specialist in Southeast Calgary, I have deep knowledge of the communities, the developments, and the market dynamics that make this quadrant unique.","features":["Private lake access in multiple communities","Seton — Calgary's newest urban district","South Health Campus and growing medical infrastructure","Wide range of new build and resale options"],"highlight_title":"Communities I Know Best","highlights":["Mahogany — Calgary's largest lake community","Auburn Bay — established lake living, strong resale","Cranston / Riverstone — nature access, premium homes","Seton — urban mixed-use, condos and townhomes","Legacy — newer family community, growing fast","Chestermere — lake city just east of Calgary"],"cta_h2_top":"Let's Talk","cta_h2_em":"Southeast Calgary","cta_p":"Southeast Calgary is my home market. I know these communities inside and out — and I'm ready to help you find your place in them."},
]

# ── GEOCODING ────────────────────────────────────────────────────────────────
def geocode(name):
    query = f"{name}, Calgary, Alberta, Canada"
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={urllib.parse.quote(query)}&key={API_KEY}"
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            data = json.loads(r.read())
        if data["status"] == "OK":
            loc = data["results"][0]["geometry"]["location"]
            return round(loc["lat"], 6), round(loc["lng"], 6)
        else:
            print(f"  GEOCODE FAILED: {name} ({data['status']})")
            return None, None
    except Exception as e:
        print(f"  GEOCODE ERROR: {name} — {e}")
        return None, None

def make_idx_url(name):
    display = name.replace(' ', '+').replace('/', '%2F')
    area = name.lower().replace(' ', '+').replace('/', '%2F').replace("'", '%27')
    return IDX_BASE.format(display=display, area=area)

# ── GEOCODE ALL COMMUNITIES ───────────────────────────────────────────────────
print("Geocoding all communities...")
geocoded = {}  # quadrant -> [(name, slug, desc, lat, lng)]
total = sum(len(v) for v in COMMUNITIES.values())
done = 0

for quadrant, comms in COMMUNITIES.items():
    geocoded[quadrant] = []
    for name, slug, desc in comms:
        lat, lng = geocode(name)
        if lat is None:
            lat, lng = 51.0447, -114.0719  # Calgary fallback
        geocoded[quadrant].append((name, slug, desc, lat, lng))
        done += 1
        print(f"  [{done}/{total}] {name}: {lat}, {lng}")
        time.sleep(0.05)

print("\nGeocoding complete. Building pages...\n")

# ── CSS ───────────────────────────────────────────────────────────────────────
SHARED_CSS = """
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{--red:#EA002A;--blue:#003DA5;--gold:#C5A572;--gold-lt:#ddc89a;--dark:#0d0d0d;--off-white:#f5f2ed;--cream:#faf8f4;--text:#1a1a1a;--muted:#777;--border:#e5e0d8;}
        body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--text);line-height:1.6;}
        #header-container{position:relative;z-index:1000;width:100%;}
        .hero{background:var(--dark);color:white;min-height:70vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding-top:80px;text-align:center;}
        .hero::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(-55deg,transparent,transparent 60px,rgba(255,255,255,0.015) 60px,rgba(255,255,255,0.015) 61px);pointer-events:none;}
        .hero::after{content:'';position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(to right,var(--red),var(--blue));}
        .hero-inner{position:relative;z-index:2;max-width:780px;padding:4rem 2rem;}
        .hero-eyebrow{display:flex;align-items:center;justify-content:center;gap:0.75rem;margin-bottom:1.75rem;}
        .eyebrow-line{width:40px;height:1px;background:var(--gold);}
        .eyebrow-text{font-size:0.7rem;letter-spacing:3px;text-transform:uppercase;color:var(--gold);font-weight:500;}
        .hero-headline{font-family:'Cormorant Garamond',serif;font-size:clamp(2.6rem,5.5vw,4.2rem);font-weight:300;line-height:1.1;color:white;margin-bottom:1.5rem;animation:fadeUp 0.7s 0.1s ease both;}
        .hero-headline em{font-style:italic;color:var(--gold-lt);}
        .hero-subhead{font-size:1.05rem;color:rgba(255,255,255,0.65);line-height:1.8;max-width:580px;margin:0 auto 2.5rem;animation:fadeUp 0.7s 0.2s ease both;}
        .hero-cta{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;animation:fadeUp 0.7s 0.3s ease both;}
        .btn-primary{display:inline-block;padding:1rem 2.5rem;background:var(--red);color:white;text-decoration:none;font-size:0.85rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;border-radius:4px;transition:all 0.25s ease;box-shadow:0 4px 20px rgba(234,0,42,0.3);}
        .btn-primary:hover{background:#c80020;transform:translateY(-2px);}
        .btn-outline{display:inline-block;padding:1rem 2.5rem;background:transparent;color:white;text-decoration:none;font-size:0.85rem;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;border-radius:4px;border:1px solid rgba(255,255,255,0.2);transition:all 0.25s ease;}
        .btn-outline:hover{border-color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.05);transform:translateY(-2px);}
        .section{padding:5rem 0;}
        .container{max-width:1100px;margin:0 auto;padding:0 2rem;}
        .section-eyebrow{display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem;}
        .section-eyebrow-centered{justify-content:center;}
        .section-eyebrow .eyebrow-line{background:var(--gold);}
        .section-eyebrow .eyebrow-text{color:var(--gold);font-size:0.7rem;letter-spacing:3px;text-transform:uppercase;font-weight:500;}
        .section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,2.8rem);font-weight:300;line-height:1.2;color:var(--text);margin-bottom:1rem;}
        .section-title em{font-style:italic;color:var(--red);}
        .about-section{background:white;}
        .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start;}
        .about-body p{color:#444;line-height:1.85;font-size:0.97rem;margin-bottom:1.25rem;}
        .feature-list{margin-top:2rem;display:flex;flex-direction:column;gap:0.75rem;}
        .feature-item{display:flex;align-items:center;gap:0.75rem;font-size:0.9rem;font-weight:500;color:var(--text);}
        .feature-dot{width:8px;height:8px;border-radius:50%;background:var(--red);flex-shrink:0;}
        .highlight-card{background:var(--cream);border:1px solid var(--border);border-radius:16px;padding:2.5rem;position:relative;}
        .highlight-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,var(--red),var(--blue));border-radius:16px 16px 0 0;}
        .highlight-card h3{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:400;margin-bottom:1.25rem;color:var(--text);}
        .highlight-card ul{list-style:none;display:flex;flex-direction:column;gap:0.65rem;}
        .highlight-card ul li{font-size:0.88rem;color:#555;padding-left:1rem;position:relative;line-height:1.6;}
        .highlight-card ul li::before{content:'→';position:absolute;left:0;color:var(--red);font-size:0.8rem;}
        .map-section{background:var(--off-white);padding:5rem 0;}
        .map-header{text-align:center;margin-bottom:2.5rem;}
        .map-header .section-eyebrow{justify-content:center;}
        .map-header p{color:var(--muted);font-size:0.9rem;margin-top:0.5rem;}
        .map-wrapper{border-radius:16px;overflow:hidden;border:1px solid var(--border);box-shadow:0 8px 40px rgba(0,0,0,0.1);}
        #community-map{width:100%;height:560px;}
        .communities-section{background:white;}
        .communities-header{text-align:center;margin-bottom:3rem;}
        .communities-header .section-eyebrow{justify-content:center;}
        .community-count{display:inline-block;font-size:0.78rem;color:var(--muted);letter-spacing:1px;margin-top:0.5rem;}
        .community-links-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;}
        .community-link-card{background:var(--cream);border:1px solid var(--border);border-radius:8px;padding:1.1rem 1rem;text-decoration:none;color:var(--text);transition:all 0.2s ease;display:flex;flex-direction:column;gap:0.2rem;}
        .community-link-card:hover{border-color:var(--red);transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,0.07);}
        .community-link-name{font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:600;color:var(--text);}
        .community-link-desc{font-size:0.72rem;color:var(--muted);line-height:1.45;}
        .community-link-arrow{font-size:0.7rem;color:var(--red);margin-top:0.3rem;font-weight:600;}
        .links-section{background:var(--off-white);}
        .links-header{text-align:center;margin-bottom:3rem;}
        .links-header .section-eyebrow{justify-content:center;}
        .quadrant-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;}
        .quadrant-card{background:white;border:1px solid var(--border);border-radius:10px;padding:1.5rem 1.25rem;text-align:center;text-decoration:none;color:var(--text);transition:all 0.25s ease;display:flex;flex-direction:column;align-items:center;gap:0.5rem;}
        .quadrant-card:hover{border-color:var(--red);transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.08);}
        .quadrant-card.hub{border-color:var(--gold);background:linear-gradient(135deg,#fff 0%,var(--cream) 100%);}
        .quadrant-card-label{font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--muted);}
        .quadrant-card-title{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:600;color:var(--text);}
        .quadrant-card-arrow{font-size:0.8rem;color:var(--red);margin-top:0.25rem;}
        .cta-section{background:var(--blue);padding:5rem 0;text-align:center;position:relative;overflow:hidden;}
        .cta-section::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(-55deg,transparent,transparent 60px,rgba(255,255,255,0.02) 60px,rgba(255,255,255,0.02) 61px);pointer-events:none;}
        .cta-section .container{position:relative;z-index:1;}
        .cta-section h2{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:300;color:white;margin-bottom:1rem;}
        .cta-section h2 em{font-style:italic;color:var(--gold-lt);}
        .cta-section p{color:rgba(255,255,255,0.7);font-size:1rem;max-width:520px;margin:0 auto 2.5rem;line-height:1.75;}
        .cta-buttons{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
        .cta-section .btn-primary{background:var(--red);box-shadow:0 4px 20px rgba(0,0,0,0.3);}
        .cta-section .btn-outline{border-color:rgba(255,255,255,0.25);}
        @media(max-width:1000px){.community-links-grid{grid-template-columns:repeat(3,1fr);}}
        @media(max-width:900px){.about-grid{grid-template-columns:1fr;gap:3rem;}.quadrant-grid{grid-template-columns:repeat(2,1fr);}.community-links-grid{grid-template-columns:repeat(2,1fr);}#community-map{height:420px;}}
        @media(max-width:600px){.hero-cta,.cta-buttons{flex-direction:column;align-items:center;}.quadrant-grid,.community-links-grid{grid-template-columns:1fr;}#community-map{height:320px;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        .reveal{opacity:0;transform:translateY(24px);transition:opacity 0.6s ease,transform 0.6s ease;}
        .reveal.visible{opacity:1;transform:translateY(0);}
"""

def build_quadrant_links(current_url):
    html = ""
    for q in all_quadrants:
        if q["url"] == current_url:
            continue
        hub_class = " hub" if q.get("hub") else ""
        html += f'\n                <a href="{q["url"]}" class="quadrant-card{hub_class}"><span class="quadrant-card-label">{q["label"]}</span><span class="quadrant-card-title">{q["title"]}</span><span class="quadrant-card-arrow">Explore →</span></a>'
    return html

def build_page(p):
    comm_key = p["comm_key"]
    communities = geocoded.get(comm_key, [])
    quadrant_slug = comm_key
    map_lat, map_lng, map_zoom = MAP_CONFIG.get(comm_key, (51.0447, -114.0719, 11))
    quad_links = build_quadrant_links(p["url"])

    features_html = "\n".join(f'                        <div class="feature-item"><div class="feature-dot"></div>{f}</div>' for f in p["features"])
    highlights_html = "\n".join(f'                    <li>{h}</li>' for h in p["highlights"])
    title_em = f" <em>{p['about_title_em']}</em>" if p.get('about_title_em') else ""

    markers_js = ""
    community_grid = ""
    for name, slug, desc, lat, lng in communities:
        guide_url = f"{GUIDE_BASE}/calgary/{quadrant_slug}/{slug}/"
        idx_url = make_idx_url(name)
        safe_name = name.replace('"', '\\"').replace("'", "\\'")
        safe_desc = desc.replace('"', '\\"').replace("'", "\\'")
        markers_js += f'  {{name:"{safe_name}",desc:"{safe_desc}",idxUrl:"{idx_url}",url:"{guide_url}",lat:{lat},lng:{lng}}},\n'
        community_grid += f'                <a href="{guide_url}" class="community-link-card"><span class="community-link-name">{name}</span><span class="community-link-desc">{desc}</span><span class="community-link-arrow">View →</span></a>\n'

    map_section = ""
    comm_section = ""
    maps_script = ""

    if communities:
        map_section = f"""
    <section class="map-section">
        <div class="container">
            <div class="map-header reveal">
                <div class="section-eyebrow section-eyebrow-centered"><div class="eyebrow-line"></div><span class="eyebrow-text">Community Map</span><div class="eyebrow-line"></div></div>
                <h2 class="section-title" style="text-align:center;">Explore <em>{p['eyebrow']}</em></h2>
                <p>Click any pin to learn about that community</p>
            </div>
            <div class="map-wrapper reveal">
                <div id="community-map"></div>
            </div>
        </div>
    </section>"""

        comm_section = f"""
    <section class="section communities-section">
        <div class="container">
            <div class="communities-header reveal">
                <div class="section-eyebrow section-eyebrow-centered"><div class="eyebrow-line"></div><span class="eyebrow-text">Explore Communities</span><div class="eyebrow-line"></div></div>
                <h2 class="section-title" style="text-align:center;">Neighbourhoods in <em>{p['eyebrow']}</em></h2>
                <span class="community-count">{len(communities)} communities</span>
            </div>
            <div class="community-links-grid reveal">
{community_grid}            </div>
        </div>
    </section>"""

        maps_script = f"""
    <script>
        var communities = [
{markers_js}        ];
        function initMap() {{
            var map = new google.maps.Map(document.getElementById('community-map'), {{
                zoom: {map_zoom},
                center: {{lat: {map_lat}, lng: {map_lng}}},
                mapTypeId: 'hybrid',
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true
            }});
            var infoWindow = new google.maps.InfoWindow();
            var pinIcon = {{path:google.maps.SymbolPath.CIRCLE,fillColor:'#EA002A',fillOpacity:1,strokeColor:'#ffffff',strokeWeight:2,scale:8}};
            communities.forEach(function(c) {{
                var marker = new google.maps.Marker({{position:{{lat:c.lat,lng:c.lng}},map:map,title:c.name,icon:pinIcon,animation:google.maps.Animation.DROP}});
                marker.addListener('click', function() {{
                    infoWindow.setContent('<div style="font-family:DM Sans,sans-serif;min-width:220px;padding:4px"><div style="font-family:Georgia,serif;font-size:1.05rem;font-weight:600;color:#1a1a1a;margin-bottom:0.4rem">'+c.name+'</div><div style="font-size:0.8rem;color:#666;line-height:1.5;margin-bottom:0.85rem">'+c.desc+'</div><div style="display:flex;gap:0.5rem;flex-wrap:wrap;"><a href="'+c.idxUrl+'" style="display:inline-block;padding:0.4rem 0.9rem;background:#EA002A;color:white;text-decoration:none;font-size:0.72rem;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-radius:3px">View Listings</a><a href="'+c.url+'" style="display:inline-block;padding:0.4rem 0.9rem;background:transparent;color:#1a1a1a;text-decoration:none;font-size:0.72rem;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-radius:3px;border:1.5px solid #e5e0d8">Learn More</a></div></div>');
                    infoWindow.open(map,marker);
                }});
            }});
        }}
    </script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key={API_KEY}&callback=initMap"></script>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{p['title']}</title>
    <meta name="description" content="{p['meta']}">
    <link rel="stylesheet" href="https://kyleduiker.github.io/duikerproperties-homepage/assets/css/header.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>{SHARED_CSS}</style>
</head>
<body>
    <div id="header-container"></div>
    <section class="hero">
        <div class="hero-inner">
            <div class="hero-eyebrow"><div class="eyebrow-line"></div><span class="eyebrow-text">{p['eyebrow']}</span><div class="eyebrow-line"></div></div>
            <h1 class="hero-headline">{p['h1_top']}<br><em>{p['h1_em']}</em></h1>
            <p class="hero-subhead">{p['subhead']}</p>
            <div class="hero-cta">
                <a href="{IDX_URL}" class="btn-primary">Browse Homes</a>
                <a href="{CONTACT_URL}" class="btn-outline">Talk to Kyle</a>
            </div>
        </div>
    </section>
    <section class="section about-section">
        <div class="container">
            <div class="about-grid">
                <div class="about-body reveal">
                    <div class="section-eyebrow"><div class="eyebrow-line"></div><span class="eyebrow-text">{p['about_eyebrow']}</span></div>
                    <h2 class="section-title">{p['about_title']}{title_em}</h2>
                    <p>{p['about_p1']}</p>
                    <p>{p['about_p2']}</p>
                    <div class="feature-list">{features_html}</div>
                </div>
                <div class="reveal">
                    <div class="highlight-card">
                        <h3>{p['highlight_title']}</h3>
                        <ul>{highlights_html}</ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
{map_section}
{comm_section}
    <section class="section links-section">
        <div class="container">
            <div class="links-header reveal">
                <div class="section-eyebrow section-eyebrow-centered"><div class="eyebrow-line"></div><span class="eyebrow-text">Explore Other Areas</span><div class="eyebrow-line"></div></div>
                <h2 class="section-title" style="text-align:center;">Browse Calgary <em>By Quadrant</em></h2>
            </div>
            <div class="quadrant-grid reveal">{quad_links}</div>
        </div>
    </section>
    <section class="cta-section">
        <div class="container reveal">
            <h2>{p['cta_h2_top']} <em>{p['cta_h2_em']}</em></h2>
            <p>{p['cta_p']}</p>
            <div class="cta-buttons">
                <a href="{IDX_URL}" class="btn-primary">Browse Homes</a>
                <a href="{PHONE}" class="btn-outline"><svg style="display:inline;vertical-align:middle;margin-right:6px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 12 19.79 19.79 0 0 1 1.04 3.42 2 2 0 0 1 3 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>{PHONE_DISPLAY}</a>
            </div>
        </div>
    </section>
    <script src="https://kyleduiker.github.io/duikerproperties-homepage/assets/js/header.js"></script>
{maps_script}
    <script>
        var reveals = document.querySelectorAll('.reveal');
        var observer = new IntersectionObserver(function(entries) {{
            entries.forEach(function(entry, i) {{
                if (entry.isIntersecting) {{
                    entry.target.style.transitionDelay = (i * 0.05) + 's';
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }}
            }});
        }}, {{threshold: 0.1}});
        reveals.forEach(function(el) {{ observer.observe(el); }});
    </script>
</body>
</html>"""

# ── OUTPUT ────────────────────────────────────────────────────────────────────
out_dir = "calgary-pages-geocoded"
os.makedirs(out_dir, exist_ok=True)

for p in pages:
    html = build_page(p)
    fpath = os.path.join(out_dir, p["filename"])
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(html)
    count = len(geocoded.get(p["comm_key"], []))
    print(f"Written: {p['filename']} ({count} communities)")

print(f"\nAll done! Files are in ./{out_dir}/")
