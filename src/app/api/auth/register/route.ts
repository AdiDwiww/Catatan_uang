import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    
    console.log('Registration attempt:', { name, email, password: password ? '[HIDDEN]' : 'MISSING' });
    
    // Validasi input
    if (!name || !email || !password) {
      console.log('Validation failed:', { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { message: 'Data tidak lengkap' },
        { status: 400 }
      );
    }
    
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    
    if (existingUser) {
      console.log('Email already exists:', email);
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Buat user baru
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    console.log('User created successfully:', { id: user.id, email: user.email });
    
    // Hapus password dari respons
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { message: 'Registrasi berhasil', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 