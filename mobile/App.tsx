import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TaskProvider>
          <RootNavigator />
        </TaskProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
