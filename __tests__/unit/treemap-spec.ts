import { Treemap } from '../../src';
import { mobile } from '../data/mobile';
import { each,clone } from '@antv/util';
import { sales } from '../data/company-sales';

describe('treemap', () => {
  const canvasDiv = document.createElement('div');
  canvasDiv.style.width = '600px';
  canvasDiv.style.height = '400px';
  canvasDiv.style.left = '30px';
  canvasDiv.style.top = '30px';
  canvasDiv.id = 'canvas1';
  document.body.appendChild(canvasDiv);
  const data = processData(mobile);
  it.only('initilize', () => {
    const treemapPlot = new Treemap(canvasDiv, {
      width: 600,
      height: 400,
      data,
      colorField: 'brand',
     /* interactions: [
        {
          type: 'drilldown',
          cfg: {
            startNode: {
              name: 'root',
            },
          } as any,
        },
      ],*/
    });
    treemapPlot.render();
  });

  it('drilldown interaction',()=>{
    const rootData = { name: '公司销售数据', value: 0, children:[]}
    each(sales,(s)=>{
      const children = clone(s.children);
      const childrenArray = [];
      each(children,(c,index)=>{
        if(c.children && c.children.length > 0){
          childrenArray.push(c);
        }
      });
      s.children = childrenArray;
      rootData.value += s.value;
      rootData.children.push(s);
    });
    const treemapPlot = new Treemap(canvasDiv, {
      width: 600,
      height: 400,
      data: rootData,
      colorField: 'name',
      interactions: [
        {
          type: 'drilldown',
          cfg: {
            startNode: {
              name: 'root',
            },
            mapping:{
              1:{
                field:'name'
              },
              2:{
                field:'name',
                values:['#f5bc32','#e66557','#71c8ea','#9362b7','#fd984f','#279493','#fd9bc3']
              },
              3:{
                field:'value',
                //values:['#d3ecc9','#78c6d0','#3e94c0','#295599','#18216c']
                values:(v)=>{
                  return ['#ffffff',v];
                }
              }
            }
          } as any,
        },
      ],
    });
    treemapPlot.render();
  });

});

function processData(data) {
  let sumValue = 0;
  each(data, (d) => {
    sumValue += d.value;
  });

  return { name: 'root', value: sumValue, children: data };
}
