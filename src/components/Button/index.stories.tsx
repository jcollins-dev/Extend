import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Button from '.';

export default {
  title: 'UI/Button',
  component: Button
} as Meta;

const Template: Story<ComponentProps<typeof Button>> = (args) => (
  <div style={{ width: '300px' }}>
    <Button {...args} />
  </div>
);

export const DefaultVariant = Template.bind({});
DefaultVariant.args = {
  children: 'Default variant',
  variant: 'default'
};

export const PrimaryVariant = Template.bind({});
PrimaryVariant.args = {
  children: 'Primary variant',
  variant: 'primary'
};

export const SecondaryVariant = Template.bind({});
SecondaryVariant.args = {
  children: 'Secondary variant',
  variant: 'secondary'
};

export const BuyNowVariant = Template.bind({});
BuyNowVariant.args = {
  children: 'Buy now variant',
  variant: 'buyNow'
};

export const DangerVariant = Template.bind({});
DangerVariant.args = {
  children: 'Danger variant',
  variant: 'danger'
};

export const WarningVariant = Template.bind({});
WarningVariant.args = {
  children: 'Warning variant',
  variant: 'warning'
};

export const ThinVariant = Template.bind({});
ThinVariant.args = {
  children: 'Thin variant',
  variant: 'thin'
};

export const ThinWithArrow = Template.bind({});
ThinWithArrow.args = {
  children: 'Thin with arrow',
  variant: 'thin',
  arrow: true
};

export const Small = Template.bind({});
Small.args = {
  children: 'Small button',
  variant: 'primary',
  size: 'small'
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Disabled',
  variant: 'primary',
  disabled: true
};

export const Link = Template.bind({});
Link.args = {
  children: 'Link',
  variant: 'link'
};

export const Inlinelink = Template.bind({});
Inlinelink.args = {
  children: 'Inline link',
  variant: 'inline-link',
  width: 'auto'
};
