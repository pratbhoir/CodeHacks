using System;
		

interface Iy
{
	void display();	
}

interface Iz
{
	void display();	
}

//Abstract methods can only be defined in abstract class.
public abstract class abs 
{
	 public abstract void display();
	 
}

public class A:abs
{
	public  override  void display()
	{
		Console.WriteLine("A: Display()");
	}
	
	public void foo()
	{
		Console.WriteLine("A: foo()");
	}
}

//parent class must be extended first, then comes all the interfaces
public class B:A, Iy,Iz 
{
	public override void display()
	{
		Console.WriteLine("B: Display()");
	}
	
	public void foo()
	{
		Console.WriteLine("B: foo()");
	}
	
	public void foo1()
	{
		Console.WriteLine("B: foo1()");
	}
}

public class Program
{
	public static void Main()
	{
		Console.WriteLine("Hello World");
		A a = new B(); 	//Parent class referece variable with child class instance
		B b = new B(); 	//Child class reference variable with child class instance
		a.foo();		//A:foo() || Cuz, Class A reference type is used, irrespective of which child class object is passed. So, only that class function will be called.
		b.foo();		//B:foo() || --Same as above--
		a.display();	//B:Display() || Cuz,function is been overriden by.
		b.display();	//B:Display()
		
	}
	
	
}
