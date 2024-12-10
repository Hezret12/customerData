import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import type { DragEndEvent, DragOverEvent, UniqueIdentifier } from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { Table } from 'antd';
import { useFetchCustomerDataMutation } from '../../redux/features/api/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface HeaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

interface BodyCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

interface DragIndexState {
  active: UniqueIdentifier;
  over: UniqueIdentifier | undefined;
  direction?: 'left' | 'right';
}

// DragIndexContext
const DragIndexContext = createContext<DragIndexState>({ active: -1, over: -1 });

const dragActiveStyle = (dragState: DragIndexState, id: string) => {
  const { active, over, direction } = dragState;
  let style: React.CSSProperties = {};
  if (active && active === id) {
    style = { backgroundColor: 'gray', opacity: 0.5 };
  } else if (over && id === over && active !== over) {
    style =
      direction === 'right'
        ? { borderRight: '1px dashed gray' }
        : { borderLeft: '1px dashed gray' };
  }
  return style;
};

const TableBodyCell: React.FC<BodyCellProps> = (props) => {
  const dragState = useContext<DragIndexState>(DragIndexContext);
  return <td {...props} style={{ ...props.style, ...dragActiveStyle(dragState, props.id) }} />;
};

const TableHeaderCell: React.FC<HeaderCellProps> = (props) => {
  const dragState = useContext(DragIndexContext);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: props.id });
  const style: React.CSSProperties = {
    ...props.style,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999, userSelect: 'none' } : {}),
    ...dragActiveStyle(dragState, props.id),
  };
  return <th {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

const MainTable: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [fetchCustomerData, { data }] = useFetchCustomerDataMutation();
  console.log(data,"data")
  const [customerData, setCustomerData] = useState<any[]>([]); 
  const searchValue = useSelector((state: RootState) => state.search.searchValue);

  const hasMore = useRef(true); 

  const loadMoreData = () => {
    fetchCustomerData({ Limit: 10, Offset: offset, Search: searchValue })
      .unwrap()
      .then((response) => {
        if (response.length < 10) hasMore.current = false; 
          setCustomerData((prev) => [...prev, ...response]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setOffset(0);
    setCustomerData([]); // Yeni arama için veri sıfırla
    hasMore.current = true; // Yeni arama başladığında hasMore sıfırla
  }, [searchValue]);


  useEffect(() => {
    loadMoreData();
  }, [offset, searchValue]);

  

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore.current) {
      setOffset((prevOffset) => prevOffset + 10);
    }
  };
  
  

  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [dragIndex, setDragIndex] = useState<DragIndexState>({ active: -1, over: -1 });

  const [columns, setColumns] = useState(() =>
    [
      { title: '#', key: 'No', render: (_: any, __: any, index: number) => index + 1, width: '9%' },
      {
        title: 'Customer Name',
        key: 'CustomerName',
        render: (_: string, record: any) =>
          'Customers' in record
            ? record.Customers.length === 1
              ? record.Customers[0].CustomerName
              : record.GroupName
            : record.CustomerName,
        width: '40%',
      },
      {
        title: 'K',
        key: 'K',
        render: (_: string, record: any) =>
          'Customers' in record
            ? record.Customers.length === 1
              ? record.Customers[0].K
                ? 'Yes'
                : 'No'
              : ''
            : record.K
            ? 'Yes'
            : 'No',
        width: '11%',
      },
      {
        title: 'E',
        key: 'E',
        render: (_: string, record: any) =>
          'Customers' in record
            ? record.Customers.length === 1
              ? record.Customers[0].E
                ? 'Yes'
                : 'No'
              : ''
            : record.E
            ? 'Yes'
            : 'No',
        width: '11%',
      },
      {
        title: 'Currency',
        key: 'Currency',
        render: (_: string, record: any) =>
          'Customers' in record
            ? record.Customers.length === 1
              ? record.Customers[0].Sign
              : ''
            : record.Sign,
        width: '15%',
      },
      {
        title: 'City ID',
        key: 'CityID',
        render: (_: string, record: any) =>
          'Customers' in record
            ? record.Customers.length === 1
              ? record.Customers[0].CityID
              : ''
            : record.CityID,
        width: '15%',
      },
    ].map((column, i) => ({
      ...column,
      key: `${i}`,
      onHeaderCell: () => ({ id: `${i}` }),
      onCell: () => ({ id: `${i}` }),
    }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setColumns((prevState) => {
        const activeIndex = prevState.findIndex((i) => i.key === active?.id);
        const overIndex = prevState.findIndex((i) => i.key === over?.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
    setDragIndex({ active: -1, over: -1 });
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const activeIndex = columns.findIndex((i) => i.key === active.id);
    const overIndex = columns.findIndex((i) => i.key === over?.id);
    setDragIndex({
      active: active.id,
      over: over?.id,
      direction: overIndex > activeIndex ? 'right' : 'left',
    });
  };

  return (
    <div className="">
      <DndContext
        sensors={sensors}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCenter}
      >
        <SortableContext items={columns.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
          <DragIndexContext.Provider value={dragIndex}>
            <Table
              dataSource={customerData || []}
              columns={columns}
              rowKey="CustomerGroupID"
              expandable={{
                expandedRowKeys,
                onExpand: (expanded, record) => {
                  if (record.Customers.length > 1) {
                    setExpandedRowKeys((prev) =>
                      expanded
                        ? [...prev, record.CustomerGroupID]
                        : prev.filter((key) => key !== record.CustomerGroupID)
                    );
                  }
                },
                expandedRowRender: (record: any) =>
                  record.Customers.length > 1 ? (
                    <Table
                      dataSource={record.Customers}
                      columns={columns}
                      rowKey="CustomerID"
                      pagination={false}
                      showHeader={false}  
                    />
                  ) : null,
                rowExpandable: (record: any) => record.Customers.length > 1,
              }}
              pagination={false}
              components={{
                header: { cell: TableHeaderCell },
                body: { cell: TableBodyCell },
              }}
              onScroll={handleScroll}
              scroll={{ y: 556 }}
            />
          </DragIndexContext.Provider>
        </SortableContext>
        <DragOverlay>
          <th style={{ backgroundColor: 'gray', padding: 16 }}>
            {columns[columns.findIndex((i) => i.key === dragIndex.active)]?.title as React.ReactNode}
          </th>
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default MainTable;
