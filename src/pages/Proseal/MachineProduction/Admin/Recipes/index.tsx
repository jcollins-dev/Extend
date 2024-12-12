// 3rd Party Libraries
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// components
import { DataRenderer } from 'components/machine-health';
import { AdminRecipeTable } from 'pages/Proseal/components';
import { useGetProsealAdminRecipeQuery, useUpdateProSealAdminRecipeMutation } from 'api';
import { Button, Typography } from 'components';
import theme from 'themes';
import { ProsealAdminRecipe } from 'types/proseal';
import { toast } from 'react-toastify';
import { UpdateProsealAdminRecipeQueryParams } from 'types/machine-production';
import { useParams } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 1rem 3rem;
}
`;

const RecipeTableContainer = styled.div`
  padding-top: 1rem;
`;

const RecipeHeader = styled(Typography)`
  color: black;
  margin: 0;
  padding: 0.75rem 0rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SubheaderContainer = styled.div``;

const SaveButton = styled(Button)`
  height: 3rem;
  margin: 0.75rem 0rem;
`;

interface Props {
  setIsDirty: (bottleneck: boolean) => void;
  isDirty: boolean;
}

const Recipes = ({ setIsDirty, isDirty }: Props): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  const { t } = useTranslation(['mh']);
  const {
    data: recipeTableData,
    isFetching: isRecipeTableLoading,
    error: recipeTableError
  } = useGetProsealAdminRecipeQuery({ machineId });

  const [updateProSealAdminRecipe] = useUpdateProSealAdminRecipeMutation();

  const [updatedValues, setUpdatedValues] = useState<UpdateProsealAdminRecipeQueryParams[]>([]);

  const quantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    record: ProsealAdminRecipe
  ) => {
    const newTargetPacksPerMin = parseInt(event.target.value);
    if (newTargetPacksPerMin !== record.targetPacksPerMinute) {
      setIsDirty(true);
      const existingValue = updatedValues.find(
        (recipe: UpdateProsealAdminRecipeQueryParams) => recipe.id === record.id
      );
      if (existingValue && updatedValues.length) {
        const newState = updatedValues.map((recipe) => {
          if (recipe.id === record.id) {
            return { recipeId: recipe.id, targetPacksPerMinute: newTargetPacksPerMin };
          }
        }) as UpdateProsealAdminRecipeQueryParams[];

        setUpdatedValues(newState);
      } else {
        const updatedValue = {
          recipeId: record.id,
          targetPacksPerMinute: newTargetPacksPerMin
        };
        setUpdatedValues((list) => [...list, updatedValue]);
      }
    }
  };

  const saveInfo = async () => {
    if (updatedValues) {
      try {
        updatedValues.forEach((requestObj) => {
          updateProSealAdminRecipe(requestObj);
        });
        setIsDirty(false);
        toast.success(t('recipe_updated'));
      } catch (error) {
        toast.error(t('recipe_not_updated'));
      }
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <SubheaderContainer>
          <RecipeHeader variant="h4" weight="bold" color={theme.colors.black} mb={2}>
            {t('recipes')}
          </RecipeHeader>
          <Typography variant="body1" color={theme.colors.mediumGrey3} size="small">
            {' '}
            {t('receipt_modify_admin_access_required')}
          </Typography>
        </SubheaderContainer>
        <SaveButton
          width="5.25rem"
          onClick={() => saveInfo()}
          disabled={!updatedValues.length && !isDirty}
        >
          {t('save', { ns: 'common' })}
        </SaveButton>
      </HeaderContainer>
      <RecipeTableContainer>
        <DataRenderer
          isLoading={isRecipeTableLoading}
          error={recipeTableError && (t('failed_to_load_data', { ns: 'common' }) as string)}
        >
          <AdminRecipeTable data={recipeTableData ?? []} quantityChange={quantityChange} />
        </DataRenderer>
      </RecipeTableContainer>
    </Container>
  );
};

export default Recipes;
