import { PrismaClient } from "@prisma/client";
import { TranslationRepository } from "../../application/repositories/translationRepository.js";
import { Translation } from "../../domain/translation.js";

const prisma = new PrismaClient();

export class PrismaTranslationRepository extends TranslationRepository{
    async save(translation){
        await prisma.translation.create({
            data:{
                id: translation.id,
                originalText: translation.originalText,
                targetLanguage:translation.targetLanguage,
                status:translation.status,
            },
        });
    }

    async findById(id){
        const result = await prisma.translation.findUnique({
            where: { id },
        });
        if (!result) return null;
        return new Translation(result);
    }

    async update(translation){
        const dataToUpdate = {
            status: translation.data.status,
            translatedText: translation.data.translatedText
        };
        console.log('Resultado da tradução', dataToUpdate)
        if(translation.data.translatedText) dataToUpdate.translatedText = translation.data.translatedText;
        if(translation.data.error) dataToUpdate.error = translation.data.error;
        await prisma.translation.update({
            where: { id: translation.id },
            data: dataToUpdate,
        });
    }
}