/**
 * verify-setup.js
 * Script para verificar que la configuración de la app desktop está correcta
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = __dirname;

class SetupVerifier {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = [];
  }

  check(name, fn) {
    try {
      if (fn()) {
        this.success.push(`✓ ${name}`);
        return true;
      } else {
        this.errors.push(`✗ ${name}`);
        return false;
      }
    } catch (err) {
      this.errors.push(`✗ ${name}: ${err.message}`);
      return false;
    }
  }

  warn(name, condition) {
    if (condition) {
      this.warnings.push(`⚠️  ${name}`);
    }
  }

  report() {
    console.clear();
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║       CTP Platanar - Verificación de Configuración          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    if (this.success.length > 0) {
      console.log('✅ VERIFICACIONES EXITOSAS:\n');
      this.success.forEach(msg => console.log('   ' + msg));
      console.log();
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  ADVERTENCIAS:\n');
      this.warnings.forEach(msg => console.log('   ' + msg));
      console.log();
    }

    if (this.errors.length > 0) {
      console.log('❌ PROBLEMAS DETECTADOS:\n');
      this.errors.forEach(msg => console.log('   ' + msg));
      console.log();
      return false;
    }

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║             🎉 CONFIGURACIÓN CORRECTA ✓                    ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    return true;
  }
}

const verifier = new SetupVerifier();

// Verificaciones
console.log('Realizando verificaciones...\n');

// 1. Node.js
verifier.check('Node.js instalado', () => {
  try {
    execSync('node --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
});

// 2. Archivos principales
verifier.check('electron-main.js existe', () => 
  fs.existsSync(path.join(projectRoot, 'electron-main.js'))
);

verifier.check('preload.js existe', () => 
  fs.existsSync(path.join(projectRoot, 'preload.js'))
);

verifier.check('package.json configurado', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  return pkg.main === 'electron-main.js' && pkg.build?.appId === 'com.ctpplatanar.attendance';
});

// 3. Directorios
verifier.check('Backend existe', () => 
  fs.existsSync(path.join(projectRoot, 'ctp-platanar-backend'))
);

verifier.check('Frontend existe', () => 
  fs.existsSync(path.join(projectRoot, 'ctp-platanar-frontend'))
);

// 4. Archivos de configuración
verifier.check('.env.example existe', () => 
  fs.existsSync(path.join(projectRoot, '.env.example'))
);

verifier.warn('.env no configurado', 
  !fs.existsSync(path.join(projectRoot, '.env'))
);

verifier.warn('Backend .env no configurado',
  !fs.existsSync(path.join(projectRoot, 'ctp-platanar-backend', '.env'))
);

// 5. Documentación
verifier.check('DESKTOP_README.md existe', () => 
  fs.existsSync(path.join(projectRoot, 'DESKTOP_README.md'))
);

verifier.check('QUICK_START.md existe', () => 
  fs.existsSync(path.join(projectRoot, 'QUICK_START.md'))
);

// 6. Scripts
verifier.check('Scripts de instalación', () => {
  return fs.existsSync(path.join(projectRoot, 'install.bat')) &&
         fs.existsSync(path.join(projectRoot, 'run.ps1'));
});

// 7. Estructura del backend
verifier.check('Modelos Sequelize', () => 
  fs.existsSync(path.join(projectRoot, 'ctp-platanar-backend', 'models'))
);

verifier.check('Rutas API', () => 
  fs.existsSync(path.join(projectRoot, 'ctp-platanar-backend', 'routes'))
);

verifier.check('server.js del backend', () => 
  fs.existsSync(path.join(projectRoot, 'ctp-platanar-backend', 'server.js'))
);

// 8. Estructura del frontend
verifier.check('src del frontend', () => 
  fs.existsSync(path.join(projectRoot, 'ctp-platanar-frontend', 'src'))
);

verifier.check('public del frontend', () => 
  fs.existsSync(path.join(projectRoot, 'ctp-platanar-frontend', 'public'))
);

// Mostrar reporte
const isValid = verifier.report();

if (!isValid) {
  process.exit(1);
}
