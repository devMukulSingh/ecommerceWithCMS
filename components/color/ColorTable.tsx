import React, { FC } from 'react'
import Header from './Header';
import { DataTable } from "../commons/DataTable";
import { ColorColumn, columns } from "../ui/ColorColumn";
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { ColorClientProps } from './ColorClientComp';

const ColorTable:FC<ColorClientProps> = async({
    storeId
}) => {
      const colors = await prisma.color.findMany({
        where: {
          storeId:storeId,
        },
      });
      const formattedcolors: ColorColumn[] = colors.map((item) => ({
        id: item.id,
        value: item.value,
        name: item.name,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
      }));
  return (
    <>
      <Header colors={colors} />
      <DataTable columns={columns} data={formattedcolors} />
    </>
  );
}

export default ColorTable