---
author: David Andrew Mullins
pubDatetime: 2026-09-16T15:22:00Z
modDatetime: 
title: "Ray Tracing in One Weekend: Part 1"
slug: ray-tracing-part-1
featured: false
draft: false
tags:
  - ray-tracing
  - cpp
description: "Initial setup and rendering the first sphere following Peter Shirley's Ray Tracing in One Weekend."
---

## Overview

This post covers my progress working through [Ray Tracing in One Weekend](https://raytracing.github.io/books/RayTracingInOneWeekend.html). The goal of this phase is to establish the basic project structure, configure the build system for modern C++, and output our first rendered image to a PPM file.

## Architecture and Setup

*(Use this section to describe how you set up the project. For example, mention if you are using CMake, how you are handling vector math classes, or any C++17/20 specific features you are utilizing to improve upon the base tutorial code).*

```cpp
// Example placeholder for core logic
#include <iostream>

int main() {
    // Image dimensions
    const int image_width = 256;
    const int image_height = 256;

    std::cout << "P3\n" << image_width << ' ' << image_height << "\n255\n";

    for (int j = 0; j < image_height; ++j) {
        std::clog << "\rScanlines remaining: " << (image_height - j) << ' ' << std::flush;
        for (int i = 0; i < image_width; ++i) {
            // Pixel calculation logic
        }
    }
    std::clog << "\rDone.                 \n";
}
```

## Progress

*(Include your thoughts on the math, debugging process, or rendering anomalies. You can drop images of your renders here).*

<img src="/assets/ray-tracing-sphere-1.png" alt="First rendered sphere" class="rounded-lg border border-skin-line shadow-md mx-auto" />

### Key Takeaways
*   **Vector Math:** Structuring the `vec3` utility class.
*   **Ray-Sphere Intersection:** Translating the quadratic equation into code.
*   **Output:** Successfully generating a `.ppm` image.

## Next Steps

In the next update, I will be implementing anti-aliasing, diffuse materials, and setting up the recursive ray bouncing logic.