import * as d3 from 'd3';
import { categoryMapping, recipeMapping } from '../../../../../../../../helpers/colorMapping';
import { renderToString } from 'react-dom/server';
import { styledTheme } from 'common/theme';

const tooltipWidth = 125;
const tooltipHeight = 75;

export default class D3Chart {
  constructor(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    element, // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    chartWidth, // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    chartHeight,
    {
      chartMargins,
      xMainAxisSelector,
      yMainAxisSelector,
      isLabelVisible,
      numberofLabels,
      dataLines
    }: {
      chartMargins: number,
      xMainAxisSelector: string,
      yMainAxisSelector: string,
      isLabelVisible: boolean,
      dataLines: Record<string, unknown>[]
    }
  ) {
    this.element = element;
    this.chartWidth = chartWidth;
    this.chartHeight = chartHeight;
    this.isLabelVisible = isLabelVisible;
    this.numberofLabels = numberofLabels;
    this.dataLines = dataLines;
    this.xMainAxisSelector = xMainAxisSelector;
    this.yMainAxisSelector = yMainAxisSelector;

    const { top, bottom, left, right } = chartMargins;

    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;

    // Calc width and height of SVG
    this.width = this.chartWidth - this.left - this.right;
    this.height = this.chartHeight - this.top - this.bottom;

    this.line1Settings = dataLines[0];
    this.line2Settings = dataLines[1];
    this.line3Settings = dataLines[2];

    this.mainData = this.line1Settings.lineSettings.data;

    // Delete svg if already exists
    d3.select(this.element).selectAll('svg').remove();

    // Create the SVG container.
    this.svg = d3
      .select(this.element)
      .append('svg')
      .classed('svg-content-responsive', true)
      .attr('width', this.width + this.left + this.right)
      .attr('height', this.height + this.top + this.bottom)
      .append('g')
      .attr('class', 'live-chart')
      .attr('transform', `translate(${this.left}, ${this.right})`);

    // Create group for X axis
    this.xAxisGroup = this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height - this.bottom})`);

    // Create group for Y axis
    this.yAxisGroup = this.svg.append('g').attr('transform', `translate(${this.left},0)`);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  update() {
    const chartHeight = this.height;
    const bisect = d3.bisector((d) => d.timestamp).center;

    // Create X axis
    const x = d3
      .scaleTime()
      .domain(d3.extent(this.mainData, (d) => d[this.xMainAxisSelector]))
      .range([this.left, this.width - this.right]);

    // Create Y axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.mainData, (d) => d[this.yMainAxisSelector])])
      .nice()
      .range([this.height - this.bottom, this.top]);

    // Call X axis
    const xAxisCall = d3
      .axisBottom(x)
      .ticks(this.width / 80)
      .tickSizeOuter(0);
    this.xAxisGroup
      .transition()
      .duration(500)
      .call(xAxisCall)
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').remove())
      .call((g) =>
        g
          .selectAll('.tick text')
          .attr('fill', styledTheme.colors.gray)
          .attr('transform', `translate(0, 10)`)
      );

    // Call Y axis
    const yAxisCall = d3.axisLeft(y).ticks(6);
    this.yAxisGroup
      .call(yAxisCall)
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', this.width - this.left - this.right)
          .transition()
          .duration(500)
          .attr('stroke-opacity', 0.1)
      )
      .attr('fill', styledTheme.colors.gray)
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .append('text')
          .attr('x', -(this.height / 2) + 10)
          .attr('y', -this.left + -10)
          .attr('fill', styledTheme.colors.gray)
          .attr('text-anchor', 'middle')
          .attr('transform', 'rotate(-90)')
          .text('Packs Per minute')
      )
      .call((g) => g.selectAll('.tick text').attr('fill', styledTheme.colors.gray))
      .call((g) => g.selectAll('.tick line').attr('stroke', styledTheme.colors.gray));

    // Data join
    const allLine1 = this.svg.selectAll('.line1').data(this.mainData);
    const allLine2 = this.svg.selectAll('.line2').data(this.mainData);
    const allLine3 = this.svg.selectAll('.line3').data(this.mainData);

    // Exit - remove old elements
    allLine1.exit().transition().duration(500).attr('height', 0).attr('y', this.height).remove();
    allLine2.exit().transition().duration(500).attr('height', 0).attr('y', this.height).remove();
    allLine3.exit().transition().duration(500).attr('opacity', 0).attr('x', this.width).remove();

    // Declare Line generator #1
    const line = d3
      .line()
      .x((d) => x(d[this.line1Settings.lineSettings.xSelector]))
      .y((d) => y(d[this.line1Settings.lineSettings.ySelector]))
      .curve(d3.curveBumpX);

    // Declare Line generator #2
    const line2 = d3
      .line()
      .x((d) => x(d[this.line2Settings.lineSettings.xSelector]))
      .y((d) => y(d[this.line2Settings.lineSettings.ySelector]));

    // Declare Line generator #3
    const line3 = d3
      .line()
      .x((d) => x(d[this.line3Settings.lineSettings.xSelector]))
      .y(this.height - this.bottom + this.line3Settings.lineSettings.ySelector);

    // Append line generator #1
    this.svg
      .append('path')
      .attr('class', 'line1')
      .attr('fill', 'none')
      .transition()
      .duration(500)
      .attr('stroke', styledTheme.colors.darkBlue)
      .attr('stroke-width', 2.5)
      .attr('d', line(this.mainData));

    // Generate different paths to show ideal ppm per recipe
    this.line2Settings.lineSettings.data.map((e) => {
      const lastItem = [e[e.length - 1]];
      // Append line generator #2
      this.svg
        .append('path')
        .attr('class', 'line2')
        .attr('fill', 'none')
        .transition()
        .duration(500)
        .attr('stroke', recipeMapping[lastItem[0].recipe])
        .attr('stroke-dasharray', '5 3')
        .attr('stroke-width', 2)
        .attr('d', line2(e));

      // Append line generator #3
      this.svg
        .append('path')
        .attr('class', 'line3')
        .attr('fill', 'none')
        .transition()
        .duration(500)
        .attr('stroke', recipeMapping[lastItem[0].recipe])
        .attr('stroke-width', 8)
        .attr('d', line3(e));

      // Append lable for line generator #2
      this.svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .selectAll()
        .data(lastItem) // attach label only to the last item
        .join('text')
        .attr('text-anchor', (d) => d.ideal_ppm)
        .attr('x', (d) => x(d[this.line2Settings.lineSettings.xSelector]))
        .attr('y', (d) => y(d[this.line2Settings.lineSettings.ySelector]))
        .attr('dy', '0.35em')
        .text((d) => d.ideal_ppm)
        .attr('fill', recipeMapping[lastItem[0].recipe]);
    });

    // Vertical Ruler
    const rule = this.svg
      .append('g')
      .append('line')
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', styledTheme.charts.alarms.Critical);

    // Add icons
    this.svg
      .append('g')
      .attr('class', 'group--label-container')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)

      .selectAll()
      .data(this.line1Settings.lineSettings.data)
      .join('foreignObject')
      .attr('x', (d) => x(d[this.line1Settings.lineSettings.xSelector]))
      .attr('y', (d) => y(d[this.line1Settings.lineSettings.ySelector]) - 15 - 5)
      .attr('class', (_, i) =>
        this.isLabelVisible ||
        i >= this.line1Settings.lineSettings.data.length - 1 - this.numberofLabels
          ? 'label-container visible'
          : 'label-container'
      )
      .attr('width', 25)
      .attr('height', 25)

      .append('xhtml:div')
      .style('color', (d) => categoryMapping[d.status_category].color)
      .style('border-color', (d) => categoryMapping[d.status_category].color)
      .style('position', 'absolute')
      .html((d) => {
        const icon = renderToString(categoryMapping[d.status_category].icon);
        return `<div class="label--inner">${icon} <span class='label--description'>${d.status}</span></div>`;
      });

    // Create the tooltip container.
    const tooltip = this.svg.append('g'); // Create the tooltip container.

    const updateRulerPosition = (e) => {
      rule.attr('y1', chartHeight);
      const i = bisect(this.mainData, x.invert(d3.pointer(e)[0]));
      rule.attr('transform', `translate(${x(this.mainData[i].timestamp)}, 0)`);
    };

    const showTooltip = (e) => {
      const i = bisect(this.mainData, x.invert(d3.pointer(e)[0]));
      tooltip.style('display', 'block');

      // Remove old point
      tooltip.selectAll('.tooltip--point').remove();

      //Add new one as cursor moves
      tooltip
        .append('circle')
        .attr('cx', x(this.mainData[i].timestamp))
        .attr('cy', y(this.mainData[i].ppm))
        .attr('r', 3)
        .attr('class', 'tooltip--point')
        .style('fill', styledTheme.colors.darkBlue);

      //Add tooltip at the top
      tooltip
        .selectAll('foreignObject')
        .data([,]) // eslint-disable-line no-sparse-arrays
        .join('foreignObject')
        .attr('x', x(this.mainData[i].timestamp))
        .attr('y', -(tooltipHeight / 4))
        .attr('class', 'tooltip-container')
        .attr('width', tooltipWidth)
        .attr('height', tooltipHeight)
        .attr('transform', `translate(-${tooltipWidth / 2},0)`)

        .join('xhtml:div')
        .style('position', 'absolute')
        .html(() => {
          const blue = styledTheme.colors.darkBlue;
          const thisMainColor = recipeMapping[this.mainData[i].recipe];
          return `<div class="tooltip--inner">
                    <div class='key'>
                      <span class='indicator' style="background-color: ${thisMainColor}"></span>
                       Ideal PPM:<span class="value" style="color: ${thisMainColor}">${this.mainData[i].ideal_ppm}</span>
                    </div>
                    <div class='key'>
                      <span class='indicator' style="background-color: ${blue}"></span>
                        PPM:<span class="value" style="color: ${blue}">${this.mainData[i].ppm}</span>
                    </div>
                    <div class='key'>
                      <span class='indicator' style="background-color: ${thisMainColor}"></span>
                        Recipe:<span class="value" style="color: ${thisMainColor}">${this.mainData[i].recipe}</span>
                    </div>
            </div>`;
        });
    };

    // When the user mouses over the chart, update it according to the date that is
    // referenced by the horizontal position of the pointer.
    this.svg.on('mousemove touchmove', function (e) {
      showTooltip(e);
      updateRulerPosition(e);
      e.preventDefault();
    });

    // Show/hide labels on click
    d3.selectAll('.label-container').on('click', (event) => {
      if (d3.select(event.currentTarget).attr('class').indexOf('visible') > -1) {
        d3.select(event.currentTarget).classed('visible', false);
        d3.select(event.currentTarget).lower(); // Bring layer to the back
      } else {
        d3.select(event.currentTarget).classed('visible', true);
        d3.select(event.currentTarget).raise(); // Bring lable to the top
      }
      event.preventDefault();
    });
  }
}
