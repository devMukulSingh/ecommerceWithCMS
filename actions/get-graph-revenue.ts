import { prisma } from "@/lib/prisma";

export interface IgraphData{
    name:string,
    total:number,
}

export const getGraphRevenue = async() => {

    const orders = await prisma.order.findMany({
        where:{
            isPaid:true,
        },
        include:{
            orderItems:{
                include:{
                    product:true,
                }
            }
        }
    });

    const totalOrders = orders.map( item => item.orderItems.map( (item) => item.product )).flat();

    const graphData:IgraphData[] = [
        {name:'Jan', total:0},
        {name:'Feb', total:0},
        {name:'Mar', total:0},
        {name:'Apr', total:0},
        {name:'May', total:0},
        {name:'Jun', total:0},
        {name:'Jul', total:0},
        {name:'Aug', total:0},
        {name:'Sep', total:0}, 
        {name:'Oct', total:0},
        {name:'Nov', total:0},
        {name:'Dec', total:0},
    ];

    let i = 1;
    for( let obj of graphData){
        let totalMonthlyRevenue = 0;
        //getting totalRevenue of a particular month 
        totalMonthlyRevenue = totalOrders.filter( item => item.updatedAt.getMonth() === i).map( (item) => item.price).reduce( (acc,next) => {
            return acc+next;
        },0 ); 
        //inserting total revenue of particular month in the graphData array 
        obj.total = totalMonthlyRevenue;
        i++;
    }   
    return graphData;
};
