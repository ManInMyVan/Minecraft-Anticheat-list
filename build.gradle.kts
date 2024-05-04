plugins {
    kotlin("multiplatform") version "1.9.23"
}

repositories {
    mavenCentral()
}

dependencies {
    commonMainImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-js:1.8.1-Beta")
}

kotlin {
    js {
        browser {}
        binaries.executable()
    }
}
