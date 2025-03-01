'use client';

import { useState } from 'react';
import { GroupComponent } from './group';
import { StockCompotent } from './table';



export function StockTable() {

    const [groupStockName, setGroupStockName] = useState("自选股");

    return (
        <div>
            <GroupComponent 
                groupStockName={groupStockName} 
                setGroupStockName={setGroupStockName}
            ></GroupComponent>
            <StockCompotent 
                groupStockName={groupStockName}
            ></StockCompotent>
            
        </div>
    );
}