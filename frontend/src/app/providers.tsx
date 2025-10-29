// src/app/providers.tsx

'use client' // 👈 これが重要！このコンポーネントをクライアント側で実行するよう指示します

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ReactNode } from 'react';

// 💡 必須ではありませんが、テーマを明示的に定義することで、
// バージョンの依存関係によるエラーを回避しやすくなります。
// ポートフォリオに合わせてカスタムテーマを設定することも可能です。
const customTheme = extendTheme({
  // ここに色、フォント、コンポーネントなどのカスタム設定を追加できます
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
})

// 受け取るプロパティの型定義
interface ProvidersProps {
  children: ReactNode;
}

/**
 * すべてのプロバイダー（Chakra UIなど）をラップするコンポーネント
 */
export function Providers({ children }: ProvidersProps) {
  return (
    // ChakraProviderで子要素（アプリケーション全体）をラップし、
    // 全体でChakra UIの機能が使えるようにします。
    <ChakraProvider theme={customTheme}>
      {children}
    </ChakraProvider>
  )
}