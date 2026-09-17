---
author: David Andrew Mullins
pubDatetime: 2026-09-17T16:54:00Z
modDatetime: 
title: "Ray Tracing in One Weekend: Part 1"
slug: ray-tracing-part-1
featured: true
draft: false
tags:
  - ray-tracing
  - cpp
  - ray-tracing-in-one-weekend
description: "Initial setup and rendering the first sphere following Peter Shirley's Ray Tracing in One Weekend."
---

## Overview

This post covers my progress working through [Ray Tracing in One Weekend](https://raytracing.github.io/books/RayTracingInOneWeekend.html). I would like to develop my raytracer in the same manner as Shirley, but using modern C++ best practices in C++20. This is my first project that I am working on while blogging, so I am going to keep it simple for now. The goal of this post is to establish the basic project structure, configure the build system, and output a rendered image.

## Architecture and Setup

Since I am on a windows PC, I am going to be using WSL. Initially, I was not a fan of WSL, but with the release of WSL2, it has gotten a lot better. 

For my build system, I've decided to go with Make for now. We will see how this project grows in scope later on to see if switching to CMAKE seems worthwhile. In any case, I've setup the makefile to have a few helpful commands. In particular, `make run` will pipe the output of the raytracer into a .ppm file automatically.

**Makefile Configuration:**
```Makefile
CXX = g++
CXXFLAGS = -std=c++20 -O3 -Wall -Wextra -Wpedantic -Iinclude -MMD -MP

SRCS = $(wildcard src/*.cpp)
OBJS = $(SRCS:.cpp=.o)
DEPS = $(OBJS:.o=.d)
TARGET = raytracer

.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

-include $(DEPS)

run: $(TARGET)
	./$(TARGET) > image.ppm

clean:
	rm -f $(OBJS) $(DEPS) $(TARGET) image.ppm

```

## Coding Progress

With the build configuration out of the way, let's jump straight into some code. For this project, I've decided to stick with floats instead of using doubles. I've also decided to use integer types from `#include <cstdint>`.

```cpp
#include <iostream>
#include <cstdint>

int main(){

    const uint16_t image_width = 1920, image_height =  1280;

    std::cout << "P3\n" << image_width << ' ' << image_height << "\n255\n"; 

    for(size_t i = 0; i < image_height; ++i){
        std::clog << "\rScanlines remaining: " << (image_height - i) << ' ' << std::flush;
        for(size_t j = 0; j < image_width; ++j){
            float r = float(j)/(image_width-1);
            float g = float(i)/(image_height-1);
            float b = 0.0f;

            uint32_t ir = uint32_t(255.0f*r);
            uint32_t ig = uint32_t(255.0f*g);
            uint32_t ib = uint32_t(255.0f*b);
        
            std::cout << ir << ' ' << ig << ' ' << ib << '\n';
        }
    }
    std::clog << "\rDone.                 \n";
    return 0;
}
```

And using `make run`, we can see the output of the .ppm image:


<img 
  src="/assets/raytracing/firstRender.png" 
  alt="First rendered image" 
  class="rounded-lg border border-skin-line shadow-md mx-auto" 
  style="width: 100%; max-width: 28rem;"
/>


**Vec3 Class**


Moving on to developing the Vec3 class. Here is where my codebase is going to diverge from the original guide dramatically. Shirley commits to using doubles explicitly, but I would like a more flexible architecture, so I have developed the class using templates. 

I am also changing the point and color classes to not have compatible operators with Vec3's, unless those operations do make sense. For example, subtracting 2 points should yield a Vec3 that points from 1 point to the other, however, adding 2 points will not be a valid operation. These changes will make it more difficult to accidentally introduce bugs in the future by explicitly showing errors instead of silently failing. 

I've also made use of `[[nodiscard]]` and `constexpr` where appropriate. 


**Vec3.h**
```cpp
#pragma once

#include <cmath>
#include <ostream>
#include <concepts>
#include <array>

template<std::floating_point T>
class Vec3 {
    public:
        using value_type = T;
        
        constexpr Vec3() = default;
        constexpr Vec3(T e0, T e1, T e2) : e{e0, e1, e2} {}

        [[nodiscard]] constexpr T x() const noexcept { return e[0]; }
        [[nodiscard]] constexpr T y() const noexcept { return e[1]; }
        [[nodiscard]] constexpr T z() const noexcept { return e[2]; }

        [[nodiscard]] constexpr Vec3 operator-() const noexcept { return Vec3{-e[0],-e[1],-e[2]}; }
        [[nodiscard]] constexpr T operator[](size_t i) const noexcept { return e[i]; }
        [[nodiscard]] constexpr T& operator[](size_t i) noexcept { return e[i]; }
        constexpr Vec3& operator+=(const Vec3& v) noexcept{
            e[0] += v[0];
            e[1] += v[1];
            e[2] += v[2];
            return *this;
        }
        constexpr Vec3& operator-=(const Vec3& v) noexcept{
            e[0] -= v[0];
            e[1] -= v[1];
            e[2] -= v[2];
            return *this;
        }
        constexpr Vec3& operator*=(T t) noexcept{
            e[0] *= t;
            e[1] *= t;
            e[2] *= t;
            return *this;
        }
        constexpr Vec3& operator*=(const Vec3& v) noexcept{
            e[0] *= v[0];
            e[1] *= v[1];
            e[2] *= v[2];
            return *this;
        }
        constexpr Vec3& operator/=(T t) noexcept{
            return *this *= T{1}/t;
        }

        [[nodiscard]] constexpr T length_squared() const noexcept {
            return e[0]*e[0] + e[1]*e[1] + e[2]*e[2];
        }
        [[nodiscard]] T length() const noexcept {
            return std::sqrt(length_squared());
        }
    private:
        std::array<T,3> e{};

};

template<std::floating_point T>
[[nodiscard]] constexpr Vec3<T> operator+(Vec3<T> v1, const Vec3<T>& v2) noexcept{
    return v1 += v2;
}

template<std::floating_point T>
[[nodiscard]] constexpr Vec3<T> operator-(Vec3<T> v1, const Vec3<T>& v2) noexcept{
    return v1 -= v2;
}

template<std::floating_point T>
inline std::ostream& operator <<(std::ostream& out, const Vec3<T>& v){
    return out << v[0] << ' ' << v[1] << ' ' << v[2];
}

template<std::floating_point T>
[[nodiscard]] constexpr Vec3<T> operator*(Vec3<T> u, const Vec3<T>& v) noexcept {
    return u *= v;
}

template<std::floating_point T>
[[nodiscard]] constexpr Vec3<T> operator*(T t, Vec3<T> v) noexcept {
    return v *= t;
}

template<std::floating_point T>
[[nodiscard]] constexpr Vec3<T> operator*(Vec3<T> v, T t) noexcept {
    return v *= t;
}

template<std::floating_point T>
[[nodiscard]] constexpr Vec3<T> operator/(Vec3<T> v, T t) noexcept {
    return v /= t;
}

template<std::floating_point T>
[[nodiscard]] constexpr T dot(const Vec3<T>& u, const Vec3<T>& v) noexcept {
    return u[0] * v[0]
         + u[1] * v[1]
         + u[2] * v[2];
}

template<std::floating_point T>
[[nodiscard]] constexpr Vec3<T> cross(const Vec3<T>& u, const Vec3<T>& v) noexcept {
    return Vec3<T>(u[1] * v[2] - u[2] * v[1],
                u[2] * v[0] - u[0] * v[2],
                u[0] * v[1] - u[1] * v[0]);
}

template<std::floating_point T>
[[nodiscard]] Vec3<T> unit_vector(const Vec3<T>& v) noexcept {
    return v / v.length();
}

using vec3  = Vec3<double>;
using vec3f = Vec3<float>;

```


### Key Takeaways
*   **Output Format Issues:** Since our max RGB value is limited to 255, I initially used a uint8_t to store these values. However, when using `std::cout`, these values are interpreted as a `char` and it does not produce an image. 
*   **Build System:** The build system works well. We will see how it scales in the next steps when adding more complex features. 

## Next Steps
In the next update, I will be continuing along with the CPU version of the project. It will contain a lot more progress. My intent is to build out the files needed for points, colors, and rays. I will then use this to output a simple sphere render. This initial post was mainly just to practice the blogging format and get started.