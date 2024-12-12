import * as d3 from 'd3';
import { format } from 'date-fns';
import { styledTheme } from 'common/theme';
import { colorMappingDotsChartAvure } from './utils';
import Icon9 from 'icons/redPin.svg';

export default class D3DotsChart {
  constructor(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    element,
    {
      data,
      height,
      width
    }: {
      data: Record<string, unknown>[],
      height: number,
      width: number
    }
  ) {
    this.width = width ? width : 800;
    this.height = height;

    this.top = 50;
    this.left = 30;
    this.bottom = 20;
    this.right = 20;

    this.element = element;
    this.data = data;

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
  update(
    data: Record<string, unknown>[],
    data2: Record<string, unknown>[],
    tooltipData: Record<string, unknown>[]
  ) {
    this.data = data;

    // Create X axis
    const x = d3
      .scaleTime()
      .domain(d3.extent(this.data, (d) => d['timestamp']))
      .nice()
      .range([this.left, this.width - this.right]);

    // Create Y axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d['value'])])
      .nice()
      .range([this.height - this.bottom, this.top]);

    // Call X axis
    const xAxisCall = d3.axisBottom(x).ticks(this.width / 80);

    this.xAxisGroup
      .call(xAxisCall)
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('y2', -this.height)
          .transition()
          .duration(500)
          .attr('stroke-opacity', 0.1)
      )
      .call((g) =>
        g
          .selectAll('.tick text')
          .attr('fill', styledTheme.colors.gray)
          .attr('transform', `translate(0, 10)`)
      )
      .call((g) => g.selectAll('.tick line:first-child').remove());

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
          .text('Stroke Counts')
      )
      .call((g) => g.selectAll('.tick text').attr('fill', styledTheme.colors.gray))
      .call((g) => g.selectAll('.tick line').attr('stroke', styledTheme.colors.gray))
      .call((g) => g.selectAll('.tick line:first-child').remove());

    // Remove old data
    this.svg
      .selectAll('circle')
      .data(this.data)
      .exit()
      .transition()
      .duration(500)
      .attr('opacity', 0)
      .remove();
    this.svg
      .selectAll('line')
      .data(this.data)
      .exit()
      .transition()
      .duration(500)
      .attr('opacity', 0)
      .remove();
    this.svg.selectAll('.tooltip--point').remove();
    this.svg
      .selectAll('.vertical-indicator')
      .data(data2)
      .exit()
      .transition()
      .duration(500)
      .attr('opacity', 0)
      .remove();

    // Append the dots.
    this.svg
      .append('g')
      .attr('fill', 'none')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('transform', (d) => `translate(${x(d['timestamp'])},${y(d['value'])})`)
      .attr('r', 3)
      .attr('fill', (d) => colorMappingDotsChartAvure[d.intensifier]);

    //Append data2(vertical lines)
    if (data2) {
      // Draw line
      this.svg
        .append('g')
        .selectAll('.vertical-indicator')
        .data(data2)
        .join('line')
        .attr('transform', (d) => `translate(${x(d['timestamp'])},0)`)
        .attr('y1', this.height)
        .attr('y2', 0)
        .attr('stroke', styledTheme.colors.status.error.base)
        .attr('stroke-width', 1);

      // Draw Error message
      this.svg
        .append('g')
        .selectAll('.message')
        .data(data2)
        .join('foreignObject')
        .attr('x', (d) => x(d['timestamp']) - 300 / 2)
        .attr('y', 0 + 23 / 2)
        .attr('class', (_, i) => `message message--${i}`)
        .attr('width', 300)
        .attr('height', 275)
        .join('xhtml:div')
        .style('position', 'absolute')
        .html((d) => {
          // TODO: refactor below when api is ready
          const item = `
            <div class='tooltip--header'>${format(new Date(d.timestamp), 'MMMM d, y - H:mm')}</div>
                  <div class='error--line-item'>
                    <span class='color-indicator' style='background-color: ${
                      colorMappingDotsChartAvure[1]
                    }'></span>
                    <span class='error--line-item--header'>Intensifier 1</span>
                    <span class='tooltip--value'><p>Rise in intensifier stroke count - Abnormally high stroke count</p></span>
                  </div>
                  <div class='error--line-item'>
                    <span class='color-indicator' style='background-color: ${
                      colorMappingDotsChartAvure[2]
                    }'></span>
                    Intensifier 2
                    <span class='tooltip--value'><p>Rise in intensifier stroke count - Abnormally high stroke count</p></span>
                  </div>
                  <div class='error--line-item'>
                    <span class='color-indicator' style='background-color: ${
                      colorMappingDotsChartAvure[3]
                    }'></span>
                    Intensifier 3
                    <span class='tooltip--value'><p>Rise in intensifier stroke count - Abnormally high stroke count</p></span>
                  </div>
                  <div class='error--line-item'>
                    <span class='color-indicator' style='background-color: ${
                      colorMappingDotsChartAvure[4]
                    }'></span>
                    Intensifier 4
                    <span class='tooltip--value'><p>Rise in intensifier stroke count - Abnormally high stroke count</p></span>
                  </div>
          `;
          return `<div class='message--inner'>${item}</div>`;
        });

      // Draw Icon
      this.svg
        .append('g')
        .selectAll('.vertical-indicator-icon')
        .data(data2)
        .join('foreignObject')
        .attr('x', (d) => x(d['timestamp']) - 17 / 2)
        .attr('y', 0 - 23 / 2)
        .attr('class', 'vertical-indicator-icon')
        .attr('width', 17)
        .attr('height', 23)
        .join('xhtml:div')
        .style('position', 'absolute')
        .html((d, i) => {
          return `<div class="vertical-indicator--mark ${i}">
                    <img src='${Icon9}' alt="Error icon" />
                  </div>`;
        });
    }

    // Create the tooltip container.
    const tooltip = this.svg.append('g'); // Create the tooltip container.

    const hideTooltip = () => {
      tooltip.selectAll('.tooltip--point').remove();
      tooltip.selectAll('.tooltip-container').remove();
    };

    const showTooltip = (e) => {
      const bisectDate = d3.bisector((d) => d.timestamp).center;

      const pointerX = x.invert(d3.pointer(e)[0]);
      const pointerY = y.invert(d3.pointer(e)[1]);

      const valueX = this.data[bisectDate(this.data, pointerX)].timestamp;

      const ds = tooltipData[valueX.toISOString()];
      const result = ds.filter((el) => {
        const diff = Math.abs(el.value - pointerY);
        return diff <= 4 ? true : false;
      });

      if (!result || result.length == 0) return;

      const resultTooltip = result && result[0];
      const currTimestamp = resultTooltip && new Date(resultTooltip['timestamp']).toISOString();
      const toolTipData = tooltipData[currTimestamp];

      //Add tooltip at the top
      tooltip
        .selectAll('foreignObject')
        .data([,]) // eslint-disable-line no-sparse-arrays
        .join('foreignObject')
        .attr('x', x(resultTooltip.timestamp) - 195 / 2)
        .attr('y', y(resultTooltip.value) - 118)
        .attr('class', 'tooltip-container')
        .attr('width', 195)
        .attr('height', 118)
        .join('xhtml:div')
        .style('position', 'absolute')
        .html(() => {
          let content = '';
          const date = format(new Date(resultTooltip.timestamp), 'MMMM d, y');
          toolTipData.map((item) => {
            const { intensifier, value, skid } = item;
            content += `<div key=${
              skid + intensifier + value
            } class='tooltip--line-item'><span class='color-indicator' style='background-color: ${
              colorMappingDotsChartAvure[intensifier]
            }'></span>Intensifier ${intensifier} - <span class='tooltip--value'>${value} stroke counts</span></div>`;
          });
          return `<div class="tooltip--inner">
                        <div class='tooltip--header'>${date}</div>
                        ${content}
                    </div>`;
        });
    };

    this.svg.on('mousemove', function (e) {
      showTooltip(e);
      e.preventDefault();
    });

    this.svg.on('mouseleave', () => {
      hideTooltip();
    });

    // Show/hide labels on click
    d3.selectAll('.vertical-indicator-icon').on('click', (e) => {
      const parent = e.target.parentNode;
      const index = parent.className.split(' ')[1];
      const message = d3.select(`.message--${index}`);
      const msg = message.select('.message--inner');

      if (msg.attr('class').indexOf('visible') > -1) {
        msg.classed('visible', false);
        message.lower();
      } else {
        msg.classed('visible', true);
        message.raise();
      }

      e.preventDefault();
    });
  }
}
