import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { fetchApartmentTypes } from '../services/api';

const { Option } = Select;

function TypeSelector({ apartment, onSelect, selectedType }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (apartment?.complexNo) {
      const loadTypes = async () => {
        setLoading(true);
        try {
          const typesData = await fetchApartmentTypes(apartment.complexNo);
          setTypes(typesData.dataBody.data);
        } catch (error) {
          console.error('Failed to load types:', error);
        } finally {
          setLoading(false);
        }
      };
      loadTypes();
    } else {
      setTypes([]);
    }
  }, [apartment]);

  return (
    <Select
      style={{ width: 200 }}
      onChange={onSelect}
      value={selectedType}
      loading={loading}
      disabled={!apartment || loading}
      placeholder="평형 및 타입 선택"
    >
      {types.map((type) => (
        <Option key={type.면적일련번호} value={type.면적일련번호}>
          {type.전용면적}㎡ ({type.공급면적}㎡)
        </Option>
      ))}
    </Select>
  );
}

export default TypeSelector; 