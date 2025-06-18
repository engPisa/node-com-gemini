import { Router } from 'express';

export const createTranslationRoutes = (translationController) => {
  const router = Router();

  /**
   * @swagger
   * tags:
   *   name: Translations
   *   description: API para gerenciamento de traduções
   */

  /**
   * @swagger
   * /translations:
   *   post:
   *     summary: Cria uma nova solicitação de tradução
   *     tags: [Translations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:   # Corrigido para garantir que os campos obrigatórios sejam definidos corretamente
   *               - text
   *               - targetLanguage
   *             properties:
   *               text:
   *                 type: string
   *                 description: O texto a ser traduzido.
   *                 example: "Hello, world!"
   *               targetLanguage:
   *                 type: string
   *                 description: O idioma de destino da tradução.
   *                 example: "Portuguese"
   *     responses:
   *       202:
   *         description: Solicitação aceita e enfileirada para processamento.
   *       400:
   *         description: Requisição inválida, campos faltando.
   */
  router.post('/translations', (req, res) => translationController.create(req, res));

  /**
   * @swagger
   * /translations/{id}:
   *   get:
   *     summary: Retorna o status de uma solicitação de tradução específica
   *     tags: [Translations]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: O ID da tradução
   *     responses:
   *       200:
   *         description: O status da tradução.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Translation'
   *       404:
   *         description: Tradução não encontrada.
   *       500:
   *         description: Erro no servidor.
   */
  router.get('/translations/:id', (req, res) => translationController.getStatus(req, res));

  return router;
};
