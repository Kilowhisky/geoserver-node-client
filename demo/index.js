import GeoServerRestClient from '../geoserver-rest-client.js';

const url = 'http://localhost:8080/geoserver/rest/';
const user = 'admin';
const pw = 'geoserver';
const grc = new GeoServerRestClient(url, user, pw);

// const ws = 'test';
// const sldBody = '<?xml version="1.0" encoding="UTF-8"?>\n<StyledLayerDescriptor version="1.0.0" \n xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" \n xmlns="http://www.opengis.net/sld" \n xmlns:ogc="http://www.opengis.net/ogc" \n xmlns:xlink="http://www.w3.org/1999/xlink" \n xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n  <NamedLayer>\n    <Name>default_line</Name>\n    <UserStyle>\n  <Title>Default Line</Title>\n      <Abstract>A sample style that draws a line</Abstract>\n   <FeatureTypeStyle>\n        <Rule>\n          <Name>rule1</Name>\n          <Title>Blue Line</Title>\n          <Abstract>A solid blue line with a 1 pixel width</Abstract>\n          <LineSymbolizer>\n            <Stroke>\n              <CssParameter name="stroke">#0000FF</CssParameter>\n            </Stroke>\n          </LineSymbolizer>\n        </Rule>\n      </FeatureTypeStyle>\n    </UserStyle>\n  </NamedLayer>\n</StyledLayerDescriptor>\n';
// const recursive = true;

// GENERAL

grc.exists().then(gsExists => {
  console.log('GeoServer REST exists', gsExists);
});
grc.getVersion().then(versionInfo => {
  console.log('GeoServer REST version info', prettyJson(versionInfo));
});

// NAMESPACES

// const nsPrefix = 'example-namespace';
// const nsUri = 'http://www.example.com'
// grc.namespaces.create(nsPrefix, nsUri).then(retVal => {
//   console.log('Created GeoServer NS', prettyJson(retVal));
// });
// grc.namespaces.getAll().then(gsNamespaces => {
//   console.log('GeoServer All NS', prettyJson(gsNamespaces));
// });
// grc.namespaces.get(nsPrefix).then(gsNamespaces => {
//   console.log('GeoServer NS', prettyJson(gsNamespaces));
// });
// grc.namespaces.delete(nsPrefix).then(gsNamespaces => {
//   console.log('Deleted GeoServer NS', prettyJson(gsNamespaces));
// });

// WORKSPACES

// grc.workspaces.getAll().then(gsWorkspaces => {
//   console.log('GeoServer All WS', prettyJson(gsWorkspaces));
// });
// grc.workspaces.create(ws).then(retVal => {
//   console.log('Created GeoServer WS', prettyJson(retVal));
// });
// grc.workspaces.delete(ws, recursive).then(retVal => {
//   console.log('Deleted GeoServer WS', prettyJson(retVal));
// });

// DATASTORES

// grc.datastores.getDataStores(ws).then(gsDataStores => {
//   console.log('GeoServer data stores in WS', ws, prettyJson(gsDataStores));
// });
// grc.datastores.getCoverageStores(ws).then(gsCovStores => {
//   console.log('GeoServer coverage stores in WS', ws, prettyJson(gsCovStores));
// });
// grc.datastores.getWmsStores(ws).then(gsWmsStores => {
//   console.log('GeoServer WMS stores in WS', ws, prettyJson(gsWmsStores));
// });
// grc.datastores.getWmtsStores(ws).then(gsWmsStores => {
//   console.log('GeoServer WMTS stores in WS', ws, prettyJson(gsWmsStores));
// });
// grc.datastores.getDataStore(ws, 'foo').then(gsStore => {
//   console.log('GeoServer data store ', prettyJson(gsStore));
// });
// grc.datastores.getCoverageStore(ws, 'foo').then(gsStore => {
//   console.log('GeoServer coverage store ', prettyJson(gsStore));
// });
// grc.datastores.getWmsStore(ws, 'foo').then(gsStore => {
//   console.log('GeoServer wms store ', prettyJson(gsStore));
// });
// grc.datastores.getWmtsStore(ws, 'foo').then(gsStore => {
//   console.log('GeoServer wmts store ', prettyJson(gsStore));
// });
// const geotiff = '/opt/STK10_32354_5670_6_nwfarbe.tif';
// grc.datastores.createGeotiffFromFile('test', 'testDs', 'HymptyLayer', 'DumptyTitle', geotiff).then(gsWmsStores => {
//   console.log('GeoServer create GeoTIFF', prettyJson(gsWmsStores));
// });
// grc.datastores.createImageMosaicStore('image_mosaics', 'myname', '/path/to/properties.zip').then(res => {
//   console.log('res', res);
// });
// grc.datastores.deleteCoverageStore('test', 'test', true).then(gsWmsStores => {
//   console.log('Deleted coverage store', prettyJson(gsWmsStores));
// });
// const wmsUrl = 'https://ows.terrestris.de/osm/service?';
// grc.datastores.createWmsStore(ws, 'testWmsDs', wmsUrl).then(retVal => {
//   console.log('Created WMS data store', prettyJson(retVal));
// });
// const wfsCapsUrl = 'https://services.meggsimum.de/geoserver/ows?service=wfs&version=1.1.0&request=GetCapabilities';
// const namespaceUrl = 'http://test';
// grc.datastores.createWfsStore(ws, 'testWfsDs', wfsCapsUrl, namespaceUrl, false).then(retVal => {
//   console.log('Created WFS data store', prettyJson(retVal));
// });
// grc.datastores.deleteDataStore(ws, 'testWfsDs', false).then(gsWmsStores => {
//   console.log('Deleted data store', prettyJson(gsWmsStores));
// });
// const initZipArchivePath = '/home/meggs/workspace/meggsimum/sauber/sauber-sdi-docker/geoserver_publisher/gs-img-mosaic-tpl/init.zip';
// grc.datastores.createImageMosaicStore('test-cm', 'testCovStore', initZipArchivePath).then(retVal => {
//   console.log('Created Image Mosaic Store', retVal);
// });
// const gpkgPath = 'natural_earth_vector.gpkg';
// grc.datastores.createGpkgStore(ws, 'testGpkgStore', gpkgPath).then(retVal => {
//   console.log('Created GPKG Store', retVal);
// });

// LAYERS

// grc.layers.get('fooWs:barLayer').then(layer => {
//   console.log('GeoServer layer by qualified name', prettyJson(layer));
// });
// grc.layers.getAll().then(allLayers => {
//   console.log('All GeoServer layers', prettyJson(allLayers));
// });
// grc.layers.publishFeatureTypeDefaultDataStore(ws, 'nativeFtName', 'aTestName', 'Test Title', 'EPSG:31468', false).then(retVal => {
//   console.log('Created Layer', prettyJson(retVal));
// });
// grc.layers.publishFeatureType(ws, 'testdataStore', 'nativeFtName', 'aTestName2', 'Test Title 2', 'EPSG:31468', true).then(retVal => {
//   console.log('Created Layer', prettyJson(retVal));
// });
// const nativeBoundingBox = {
//   minx: 8.15,
//   maxx: 8.16,
//   miny: 50.0,
//   maxy: 50.1,
//   crs: {
//     '@class': 'projected',
//     $: 'EPSG:4326'
//   }
// };
// grc.layers.publishFeatureType(ws, 'testdataStore', 'nativeFtName', 'aTestNameBbox', 'Test Title Bbox', 'EPSG:4326', true, null, nativeBoundingBox).then(retVal => {
//   console.log('Created FT with explicit native BBOX', prettyJson(retVal));
// });
// grc.layers.publishWmsLayer(ws, 'testWmsDs', 'OSM-Overlay-WMS', 'aTestName4Wms', 'Test Title WMS', 'EPSG:900913', true).then(retVal => {
//   console.log('Created WMS Layer', prettyJson(retVal));
// });
// grc.layers.publishDbRaster(ws, 'testdataStore', 'nativeRasterName', 'a-db-raster', 'Dummy DB Raster Title', null, true).then(retVal => {
//   console.log('Created DB Raster Layer', prettyJson(retVal))
// });
// grc.layers.deleteFeatureType(ws, 'testdataStore', 'aTestName2', true).then(retVal => {
//   console.log('Deleted Layer', prettyJson(retVal))
// });
// grc.layers.enableTimeCoverage(ws, 'testDs', 'HymptyLayer', 'DISCRETE_INTERVAL', 3600000, 'MAXIMUM').then(retVal => {
//   console.log('Enabled time for layer', prettyJson(retVal))
// });
// grc.layers.getCoverage(ws, 'testCovStore', 'testCoverage').then(cov => {
//   console.log(cov.coverage);
// });

// STYLES

// grc.styles.getDefaults().then(gsWorkspaces => {
//   console.log('GeoServer default styles', prettyJson(gsWorkspaces));
// });
// grc.styles.getInWorkspace(ws).then(gsWorkspaces => {
//   console.log('GeoServer styles for WS', prettyJson(gsWorkspaces));
// });
// grc.styles.getAllWorkspaceStyles().then(allGsWsStyles => {
//   console.log('GeoServer all WS styles', prettyJson(allGsWsStyles));
// });
// grc.styles.getAll().then(allGsStyles => {
//   console.log('GeoServer all styles', prettyJson(allGsStyles));
// });
// grc.styles.publish(ws, 'testStyle3', sldBody).then(retVal => {
//   console.log('Publish GeoServer style', retVal);
// });

// IMAGEMOSAIC

// grc.imagemosaics.getGranules('imagemosaic_test', 'testCovStore', 'testCov').then(retVal => {
//   console.log('Get Granules Image Mosaic', retVal);
// });
// const filePathCoverages = 'file:///opt/raster_data'
// grc.imagemosaics.harvestGranules('imagemosaic_test', 'testCovStore', filePathCoverages).then(retVal => {
//   console.log('Harveset Granules Image Mosaic', retVal);
// });
// const coverageToAdd = 'file:///opt/raster_data/a.tif'
// grc.imagemosaics.addGranuleByServerFile('imagemosaic_test', 'testCovStore', coverageToAdd).then(retVal => {
//   console.log('Add Granule by Server File', retVal);
// });
// const coverageToDelete = '/opt/raster_data/a.tif';
// grc.imagemosaics.deleteSingleGranule('imagemosaic_test', 'testCovStore', 'testCov', coverageToDelete).then(retVal => {
//   console.log('Deleting Granule', retVal);
// });

function prettyJson (obj) {
  return JSON.stringify(obj, null, 2);
}
