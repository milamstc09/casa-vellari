"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirFuncionario } from "@/lib/permissoes";
import { apagarImagem, enviarImagem, temArquivo, validarImagem } from "@/lib/upload";
import { pratoSchema, type EstadoPrato } from "@/lib/validacoes/prato";

function lerCampos(formData: FormData) {
  return {
    nome: String(formData.get("nome") ?? ""),
    descricao: String(formData.get("descricao") ?? ""),
    preco: String(formData.get("preco") ?? ""),
    categoria: String(formData.get("categoria") ?? ""),
  };
}

function validar(valores: ReturnType<typeof lerCampos>) {
  // aceita vírgula no preço (ex.: 58,90)
  return pratoSchema.safeParse({ ...valores, preco: valores.preco.replace(",", ".") });
}

function atualizarPaginas() {
  revalidatePath("/admin/pratos");
  revalidatePath("/cardapio");
  revalidatePath("/");
}

export async function criarPrato(
  _estadoAnterior: EstadoPrato,
  formData: FormData
): Promise<EstadoPrato> {
  const session = await exigirFuncionario();

  const valores = lerCampos(formData);
  const resultado = validar(valores);
  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message, valores };
  }

  const arquivo = formData.get("imagem");
  const erroImagem = validarImagem(arquivo);
  if (erroImagem) return { erro: erroImagem, valores };

  let imagemUrl: string | null = null;
  if (temArquivo(arquivo)) {
    try {
      imagemUrl = await enviarImagem(arquivo);
        } catch (e) {
      const motivo = e instanceof Error ? e.message : String(e);
      console.error("Falha no upload do Blob:", motivo);
      return { erro: `Falha no envio da imagem: ${motivo}`, valores };
    }
  }

  try {
    await prisma.prato.create({
      data: { ...resultado.data, imagemUrl, criadoPorId: session.user.id },
    });
        } catch (e) {
      const motivo = e instanceof Error ? e.message : String(e);
      console.error("Falha no upload do Blob:", motivo);
      return { erro: `Falha no envio da imagem: ${motivo}`, valores };
    }

  atualizarPaginas();
  redirect("/admin/pratos?ok=" + encodeURIComponent("Prato criado com sucesso."));
}

export async function editarPrato(
  _estadoAnterior: EstadoPrato,
  formData: FormData
): Promise<EstadoPrato> {
  await exigirFuncionario();

  const id = String(formData.get("id") ?? "");
  const valores = lerCampos(formData);

  const resultado = validar(valores);
  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message, valores };
  }

  const atual = await prisma.prato.findUnique({ where: { id } });
  if (!atual) return { erro: "Prato não encontrado.", valores };

  const arquivo = formData.get("imagem");
  const erroImagem = validarImagem(arquivo);
  if (erroImagem) return { erro: erroImagem, valores };

  let imagemUrl = atual.imagemUrl;
  if (temArquivo(arquivo)) {
    try {
      imagemUrl = await enviarImagem(arquivo);
        } catch (e) {
      const motivo = e instanceof Error ? e.message : String(e);
      console.error("Falha no upload do Blob:", motivo);
      return { erro: `Falha no envio da imagem: ${motivo}`, valores };
    }
  }

  try {
    await prisma.prato.update({ where: { id }, data: { ...resultado.data, imagemUrl } });
         } catch (e) {
      const motivo = e instanceof Error ? e.message : String(e);
      console.error("Falha no upload do Blob:", motivo);
      return { erro: `Falha no envio da imagem: ${motivo}`, valores };
    }

  if (imagemUrl !== atual.imagemUrl) await apagarImagem(atual.imagemUrl);

  atualizarPaginas();
  redirect("/admin/pratos?ok=" + encodeURIComponent("Prato atualizado com sucesso."));
}

export async function excluirPrato(formData: FormData) {
  await exigirFuncionario();

  const id = String(formData.get("id") ?? "");
  const prato = await prisma.prato.findUnique({ where: { id } });

  if (prato) {
    await prisma.prato.delete({ where: { id } });
    await apagarImagem(prato.imagemUrl);
  }

  atualizarPaginas();
  redirect("/admin/pratos?ok=" + encodeURIComponent("Prato excluído."));
}
