import { z } from 'zod';

// 制御文字 (ASCII 0-31, 127) をチェック（改行・タブ等の一部許可も検討しつつ、危険なNULLバイトや不可視制御文字を遮断）
const sanitizeInputRegex = /^[\P{Cc}\r\n\t]+$/u;

export const searchObjectInputSchema = z.object({
  query: z
    .string({
      required_error: '検索キーワードは必須です',
      invalid_type_error: '検索キーワードは文字列である必要があります'
    })
    .trim()
    .min(2, { message: '検索キーワードは2文字以上入力してください' })
    .max(300, { message: '検索キーワードは300文字以内で入力してください' })
    .refine((val) => sanitizeInputRegex.test(val), {
      message: '不正な制御文字が含まれています'
    })
});

export type SearchObjectInput = z.infer<typeof searchObjectInputSchema>;
