import { put, del } from "@vercel/blob";

const TAMANHO_MAXIMO = 2 * 1024 * 1024; // 2 MB
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function temArquivo(valor: FormDataEntryValue | null): valor is File {
  return valor instanceof File && valor.size > 0;
}

// Devolve a mensagem de erro, ou null se estiver tudo certo (ou se não houver arquivo).
export function validarImagem(valor: FormDataEntryValue | null): string | null {
  if (!temArquivo(valor)) return null;
  if (!TIPOS_PERMITIDOS.includes(valor.type)) {
    return "O arquivo precisa ser uma imagem (JPG, PNG, WEBP ou GIF).";
  }
  if (valor.size > TAMANHO_MAXIMO) {
    return "A imagem deve ter no máximo 2 MB.";
  }
  return null;
}

export async function enviarImagem(arquivo: File): Promise<string> {
  const nome = arquivo.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const blob = await put(`pratos/${nome}`, arquivo, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function apagarImagem(url: string | null | undefined) {
  if (!url || !url.includes("blob.vercel-storage.com")) return;
  try {
    await del(url);
  } catch {
    // se não conseguir apagar a imagem antiga, o sistema continua funcionando
  }
}
