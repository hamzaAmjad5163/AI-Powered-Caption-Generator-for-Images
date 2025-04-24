import React from 'react';
import styled from 'styled-components';
import ImageFilter from 'react-image-filter';

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
`;

const FilterOption = styled.div`
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const FilterLabel = styled.p`
  text-align: center;
  margin-top: 0.5rem;
`;

const filters = {
  none: [1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0],
  sepia: [1, 0, 0, 0, 0, 1, 0.3, 0, 0, 0, 0.8, 0, 0, 0, 0, 1, 1],
  blackAndWhite: [0.33, 0.33, 0.33, 0, 0.33, 0.33, 0.33, 0, 0.33, 0.33, 0.33, 0, 0, 0, 0, 1, 1],
  vintage: [0.9, 0.5, 0.1, 0, 0.3, 0.8, 0.1, 0, 0.2, 0.3, 0.5, 0, 0, 0, 0, 1, 1],
  cool: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0.2, 0.2, 1, 0]
};

const ImageFilters = ({ image, onFilterSelect }) => {
  if (!image) return null;

  return (
    <FilterContainer>
      {Object.entries(filters).map(([name, filter]) => (
        <FilterOption key={name} onClick={() => onFilterSelect(name)}>
          <ImageFilter
            image={image}
            filter={filter}
            style={{ width: '100px', height: '100px', borderRadius: '8px' }}
          />
          <FilterLabel>{name.charAt(0).toUpperCase() + name.slice(1)}</FilterLabel>
        </FilterOption>
      ))}
    </FilterContainer>
  );
};

export default ImageFilters;