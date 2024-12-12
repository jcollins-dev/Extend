// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { CatalogCard, Column, PageHeader, Row } from 'components';
import { faDashboard } from '@fortawesome/free-solid-svg-icons';

// Styling
const Container = styled.div`
  width: 100%;
  padding: 1.5rem 3.125rem 0 3.125rem;
  margin-top: 2rem;
`;

const CardContainer = styled.div`
  width: 18.333125rem;
  height: 14.25rem;
  background-color: ${(props) => props.theme.colors.background.background1};
  border-radius: 0.625rem;
  border: ${(props) => props.theme.colors.borders.border01.border};
`;

const Admin = (): JSX.Element => {
  return (
    <>
      <PageHeader heading="Admin" icon={{ iconElement: faDashboard, iconType: 'fa' }} />
      <Container>
        <Row>
          <Column>
            <CardContainer>
              <CatalogCard
                name="Onboard a customer machine"
                link=""
                img="/assets/placeholder/machines/place-holder.jpg"
              />
            </CardContainer>
          </Column>
        </Row>
      </Container>
    </>
  );
};

export default Admin;
