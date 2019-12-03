let view;
let getURL;

require ([
  'esri/Map',
  'esri/views/MapView',
  'esri/Basemap',
  'esri/layers/VectorTileLayer',
  'esri/layers/FeatureLayer',
  'esri/widgets/Home',
  'esri/widgets/Expand'
], 
function(
  Map, 
  MapView, 
  Basemap, 
  VectorTileLayer, 
  FeatureLayer,
  Home,
  Expand
) {

    //* Picture Marker Symbol
    const flSymbol = {
      type: 'picture-marker',
      url: 'images/map-symbols/dog.png',
      height: '25 px',
      width: '25 px'
    }
  
    //* FeatureLayer Renderer
    const flRenderer = {
      type: 'simple',
      symbol: flSymbol
    }

      //* VectorTileLayer Object
    const vtLayer = new VectorTileLayer({
      portalItem: {
        id: '0e82bb1babc947c19c4bf04c810a33fe'
      }
    })
  
    //* Basemap Object
    const myBasemap = new Basemap({
      baseLayers: [vtLayer]
    });
 
    //* create the Map object
    const map = new Map({
      basemap: myBasemap
    });

    //* Creat the Map View object
    view = new MapView({
      container: 'viewDiv',
      map: map,
      center: [-98.8101768493388, 37.814666152234636],
      zoom: 4

    });

    //* Home widget
    const homeBtn = new Home({
      view: view
    });
    view.ui.add(homeBtn, 'top-left');

    const expandContent = '<h3 style="color: #A78176">I Met a Dog!</h3>' + 
    '<span style="color: #EA9E49">' + 
    'This is a fun side project I developed to track the dogs I meet and interact with while living my life. Most are located in Central Arkansas, but with other regions included as I travel.<br><br>' + 
    'Some of the dogs are part of cross country transports of rescue dogs out of the South to the North East and Upper Midwest.<br><br>' + 
    'I use this project to experiment with aspects of web development, mostly relating to WebGIS and the ' + 
    '<span style="color: #EA9E49; font-style: italic">ArcGIS API for Javascript</span>. ' +  
    'I used Esri\'s ' + 
    '<span style="color: #EA9E49; font-style: italic">ArcGIS Vector Tile Style Editor</span> to style the basemap.<br><br></span>' +
    '<span style="color: #A78176 ; font-weight: 900">Contact</span><br>' +
    '<span style="color: #EA9E49">Bradley Jones</span><br>' +
    '<a href="mailto:webmaster@example.com">bjones@dogwoodgeo.com</a><br>' 
    
    infoExpand = new Expand({
      expandIconClass: 'esri-icon-description',
      view: view,
      content: expandContent,
      expanded: false,
    })
    view.ui.add(infoExpand, 'top-right');

    //* Popup object
    const popupTemplate = {
      title: '<span style="color: #A78176 ; font-weight: 900">Dog Information</span>',
      outFields: ['*'],
      content: getURL,
      fieldInfos: [
        {
          fieldName: 'DATE_FIRST',
          format: {
            dateFormat: 'day-short-month-year'
          }
        }, {
          fieldName: 'DATE_LAST',
          format: {
            dateFormat: 'day-short-month-year'
          }
        }
      ]
    };

    const dogsFL = new FeatureLayer({
      url: "https://services.arcgis.com/mJnFdAAVXxEXrSpL/arcgis/rest/services/DOGS/FeatureServer",
      popupTemplate: popupTemplate,
      renderer: flRenderer,
    });
  
    //* Add the layer to the map
    map.add(dogsFL); 

    //* Popup Content
    const popupHTML = '<span style="color: #EA9E49 ; font-weight: bold">Type:</span> {TYPE}' + 
    '<br><span style="color: #EA9E49 ; font-weight: bold">Name:</span> {NAME}' + 
    '<br><span style="color: #EA9E49 ; font-weight: bold">Male/Female:</span> {MF}' +
    '<br><span style="color: #EA9E49 ; font-weight: bold">Age Class:</span> {AGECLASS}' + 
    '<br><span style="color: #EA9E49 ; font-weight: bold">Friendly (0-5):</span> {FRIENDLY}' + 
    '<br><span style="color: #EA9E49 ; font-weight: bold">Good Dog?:</span> {GOODOG}' + 
    '<br><span style="color: #EA9E49 ; font-weight: bold">Date:</span> {DATE_FIRST}' + 
    '<br><span style="color: #EA9E49 ; font-weight: bold">Multiple Meetings:</span> {MULT_MEET}' + 
    '<br><span style="color: #EA9E49 ; font-weight: bold">Date of Last Meeting:</span> {DATE_LAST}' + 
    '<br><span style="color: #EA9E49 ; font-weight: bold">Meeting Number:</span> {MEET_NUM}' + 
    '<br><span style="color: #EA9E49 ; font-weight: bold">Photo:</span> {PIC}' +
    '<br><span style="color: #EA9E49 ; font-weight: bold">Transport?:</span> {TRANSPORT}' + 
    '<br><span style="color: #EA9E49 ; font-weight: bold">Transport Destination.:</span> {TRANS_DEST} ' + 
    '<br><span style="color: #EA9E49 ; font-weight: bold">Transport Org:</span> {TRANS_ORG} ' +  
    '<br><span style="color: #EA9E49 ; font-weight: bold">Location:</span> {LOC_DESC}' + 
    '<br><br><span style="color: #EA9E49">{COMMENTS}</span>';

    function getURL(feature) { 
      let url = feature.graphic.attributes.PIC_URL;
      console.log (url);
      if (url === 'null') {
      return (popupHTML)
      } else {
      return ( `<img src="${url}" alt="DOG"></img><br>${popupHTML}` )
      };
    } 
  }
);