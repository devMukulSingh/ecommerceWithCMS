import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server";


export async function PATCH(
    req:Request,
    { params } : {
        params : { storeId: string, categoryId:string}
    }
){
    try {

    const { userId } = auth();
    const { storeId, categoryId } = params;
    const body = await req.json();
    const { name,billboardId } = body;

    if( !userId ) return NextResponse.json({ msg:'Unauthenticated',status:403});

    if( !storeId ) return NextResponse.json({ msg:'StoreId is required', status:400});
    
        if( !categoryId ) return NextResponse.json({ msg:'CategoryId is required', status:400});
    
        if( !name ) return NextResponse.json( { msg:'Name is required', status:400});
    
        if( !billboardId ) return NextResponse.json( { msg:'BillboardId is required', status:400});
    
        const storeByUserId = await prisma.store.findUnique({
            where:{
                userId,
                id: storeId
            }
        });
    
        if( !storeByUserId ) return NextResponse.json({ msg:'Unauthorised',status:401});
    
        const category = await prisma.category.update({
            where:{
                id:categoryId,
                storeId,
            },
            data : {
                name,
                billboardId
            }
        });
    
        return NextResponse.json({ category, status:201});
    } catch (error) {
        console.log(`Error in Category PATCH ${error}`);
        return NextResponse.json({ msg:'Error in Category PATCH ${error}', status:500});
    }

}

export async function DELETE(
    req:Request,
    { params } : {
        params : { storeId: string, categoryId:string}
    }
){
    try {

    const { userId } = auth();
    const { storeId, categoryId } = params;

    if( !userId ) return NextResponse.json({ msg:'Unauthenticated',status:403});

    if( !storeId ) return NextResponse.json({ msg:'StoreId is required', status:400});
    
    if( !categoryId ) return NextResponse.json({ msg:'CategoryId is required', status:400});
        
        const storeByUserId = await prisma.store.findUnique({
            where:{
                userId,
                id: storeId
            }
        });
    
        if( !storeByUserId ) return NextResponse.json({ msg:'Unauthorised',status:401});
    
        const category = await prisma.category.delete({
            where:{
                id:categoryId,
                storeId,
            },
        });
    
        return NextResponse.json({ msg:'Category Deleted', status:200});
    } catch (error) {
        console.log(`Error in Category PATCH ${error}`);
        return NextResponse.json({ msg:`Error in Category DELTE handler ${error}`, status:500});
    }

}

export async function GET(
    req:Request,
    { params } : {
        params : { storeId: string, categoryId:string}
    }
){
    try {
        const { storeId, categoryId } = params;
    
        if( !storeId ) return NextResponse.json({msg:'Store Id is required'});
    
        if( !categoryId ) return NextResponse.json({msg:'CategoryId is required'});
    
        const category = await prisma.category.findUnique({
            where:{
                id:categoryId,
                storeId
            }
        });
        return NextResponse.json({ category, status:200});

    }catch (error) {
        console.log(`Error in Category GET request ${error}`);
        return NextResponse.json({ msg:`Error in Category GET request ${error}`,status:500 })
    }
}