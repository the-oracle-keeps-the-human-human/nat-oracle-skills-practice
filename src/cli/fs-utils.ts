import { existsSync, mkdirSync, rmSync, cpSync, copyFileSync } from 'fs';
import { $ } from 'bun';

const isWindows = process.platform === 'win32';

export async function mkdirp(dir: string): Promise<void> {
  if (!isWindows) {
    await $`mkdir -p ${dir}`.quiet();
  } else {
    mkdirSync(dir, { recursive: true });
  }
}

export async function rmrf(path: string): Promise<void> {
  if (!existsSync(path)) return;
  if (!isWindows) {
    await $`rm -rf ${path}`.quiet();
  } else {
    rmSync(path, { recursive: true, force: true });
  }
}

export async function cpr(src: string, dest: string): Promise<void> {
  if (!isWindows) {
    await $`cp -r ${src} ${dest}`.quiet();
  } else {
    cpSync(src, dest, { recursive: true });
  }
}

export async function cp(src: string, dest: string): Promise<void> {
  if (!isWindows) {
    await $`cp ${src} ${dest}`.quiet();
  } else {
    copyFileSync(src, dest);
  }
}

export async function rmf(path: string): Promise<void> {
  if (!existsSync(path)) return;
  if (!isWindows) {
    await $`rm -f ${path}`.quiet();
  } else {
    rmSync(path, { force: true });
  }
}
